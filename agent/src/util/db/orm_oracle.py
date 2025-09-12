import pandas as pd
from typing import List, Optional, Sequence, Any, Type
from sqlalchemy import text


class OrmOracle:

    @staticmethod
    def merge_upsert(
            session,
            model_class: Type[Any],
            df: pd.DataFrame,
            use_columns: Sequence[str],
            pk_columns: Sequence[str],
            *,
            update_policy: str = "all_except_pk",               # policy: 'all_except_pk' | 'only' | 'none'
            update_columns: Optional[Sequence[str]] = None,     # update_policy='only'에서만 사용
            skip_nulls_on_update: bool = False,                 # True면 NULL은 덮어쓰지 않음
    ):
        """
        - pk_columns : ON조건에만 사용, UPDATE 대상에서 자동 제외
        - update_policy:
            * 'all_except_pk' : DF와 테이블 교집합 중 PK 제외 전부 업데이트
            * 'only'          : update_columns에 지정된 컬럼만 업데이트
            * 'none'          : 매칭 시 UPDATE 생략(즉, INSERT-ONLY upsert)
        - skip_nulls_on_update:
            * True면 UPDATE SET에서 각 컬럼을
              t.col = CASE WHEN s.col IS NULL THEN t.col ELSE s.col END
              로 생성해 NULL 덮어쓰기를 방지합니다.
        """
        target_table = model_class.__table__

        if update_policy == "none":
            upd_cols: List[str] = []
        elif update_policy == "only":
            cols = list(update_columns or [])
            upd_cols = [c for c in cols if c in use_columns and c not in pk_columns]
        else:  # 'all_except_pk' (default)
            upd_cols = [c for c in use_columns if c not in pk_columns]

        # 5. create MERGE-SQL
        table_identifier = f"{target_table.schema}.{target_table.name}" if target_table.schema else target_table.name
        select_list = ", ".join([f":{c} AS {c}" for c in use_columns])
        on_clause = " AND ".join([f"t.{pk} = s.{pk}" for pk in pk_columns])
        if upd_cols:
            if skip_nulls_on_update:
                set_exprs = ", ".join([f"t.{c} = CASE WHEN s.{c} IS NULL THEN t.{c} ELSE s.{c} END" for c in upd_cols])
            else:
                set_exprs = ", ".join([f"t.{c} = s.{c}" for c in upd_cols])
            matched_clause = f"WHEN MATCHED THEN UPDATE SET {set_exprs}"
        else:
            matched_clause = ""
        insert_cols = ", ".join(use_columns)
        insert_vals = ", ".join([f"s.{c}" for c in use_columns])
        merge_sql = f"""
                MERGE INTO {table_identifier} t
                USING (SELECT {select_list} FROM dual) s
                ON ({on_clause})
                {matched_clause}
                WHEN NOT MATCHED THEN INSERT ({insert_cols}) VALUES ({insert_vals})
            """

        # 6. executemany
        params = df.to_dict(orient="records")
        session.execute(text(merge_sql), params)
