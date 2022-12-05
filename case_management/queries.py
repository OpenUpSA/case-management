LEGALCASE_OPEN_CLOSE = """
SELECT
    legalcase.id,
    legalcase.created_at::date,
    MAX(CASE
          WHEN logchange.field = 'state' AND logchange.value = 'Closed'
          THEN log.created_at
          ELSE NULL
      END)::date closed_at
FROM
    case_management_legalcase legalcase
LEFT JOIN case_management_log log ON
    legalcase.id = log.target_id
LEFT JOIN case_management_logchange logchange ON
    log.id = logchange.log_id
GROUP BY
    legalcase.id"""

LEGALCASE_OPEN_CLOSE_DAYS = """
SELECT
    *,
    CASE
        WHEN closed_at IS NULL
      THEN NULL
        ELSE closed_at - created_at
    END days_created_to_closed
FROM
    legalcase_open_close"""


LEGALCASE_DETAIL_BY_CASEOFFICE = """
SELECT
    legalcase.id,
    legalcase.created_at,
    legalcase.closed_at,
    legalcase.days_created_to_closed,
    case_office.caseoffice_id
FROM
    legalcase_open_close_days legalcase,
    case_management_legalcase_case_offices case_office
WHERE
    legalcase.id = case_office.legalcase_id"""


def case_office_filter(case_office=None):
    phrase = "" if case_office is None else f"WHERE caseoffice.id = '{case_office}'"
    return phrase

def range_summary(start_date, end_date, case_office=None):
    return f"""
WITH
  date_range AS (
  	SELECT
  		'{start_date}'::date AS start_date,
  		'{end_date}'::date AS end_date
  ),
  legalcase_open_close AS (
  	{LEGALCASE_OPEN_CLOSE}
  ),
  legalcase_open_close_days AS (
  	{LEGALCASE_OPEN_CLOSE_DAYS}
  ),
  legalcase_detail_by_caseoffice AS (
  	{LEGALCASE_DETAIL_BY_CASEOFFICE}
  ),
  metric_cases_opened AS (
  	SELECT
  		legalcase.caseoffice_id,
  		COUNT(id) n
  	FROM
  		legalcase_detail_by_caseoffice legalcase,
  		date_range
  	WHERE
  		legalcase.created_at BETWEEN date_range.start_date AND date_range.end_date
  	GROUP BY
  		legalcase.caseoffice_id
  ),
  metric_cases_closed AS (
  	SELECT
  		legalcase.caseoffice_id,
  		COUNT(id) n
  	FROM
  		legalcase_detail_by_caseoffice legalcase,
  		date_range
  	WHERE
  		legalcase.closed_at BETWEEN date_range.start_date AND date_range.end_date
  	GROUP BY
  		legalcase.caseoffice_id
  ),
  metric_open_cases AS (
  	SELECT
  		legalcase.caseoffice_id,
  		COUNT(id) n
  	FROM
  		legalcase_detail_by_caseoffice legalcase,
  		date_range
  	WHERE
  		legalcase.created_at <= date_range.end_date
  		AND (
  			legalcase.closed_at IS NULL
  				OR legalcase.closed_at >= date_range.end_date
  		)
  	GROUP BY
  		legalcase.caseoffice_id
  ),
  active_users_by_caseoffice AS (
  	SELECT
  		users.case_office_id,
  		users.name
  	FROM
  		case_management_log AS log,
  		case_management_user AS users
  	WHERE
  		log.user_id = users.id
  	GROUP BY
  		users.case_office_id,
  		users.name
  ),
  metric_active_users AS (
  	SELECT
  		case_office_id,
  		COUNT(name) AS n
  	FROM
  		active_users_by_caseoffice
  	GROUP BY
  		case_office_id
  ),
  metric_avg_open_cases_per_active_user AS (
  	SELECT
  		open_cases.caseoffice_id,
  		open_cases.n / active_users.n n
  	FROM
  		metric_open_cases open_cases,
  		metric_active_users active_users
  	WHERE
  		open_cases.caseoffice_id = active_users.case_office_id
  ),
  metric_avg_days_per_case AS (
  	SELECT
  		legalcase.caseoffice_id,
  		legalcase.days_created_to_closed n
  	FROM
  		legalcase_detail_by_caseoffice legalcase,
  		date_range
  	WHERE
  		legalcase.closed_at BETWEEN date_range.start_date AND date_range.end_date
  	GROUP BY
  		legalcase.caseoffice_id,
  		legalcase.days_created_to_closed
    LIMIT 1
  )
SELECT
	json_object_agg(
    name, json_build_object(
      'Active case officers', (
              SELECT n
              FROM metric_active_users active_users
              WHERE active_users.case_office_id = caseoffice.id
      ),
      'Total cases', (
              SELECT n
              FROM metric_open_cases open_cases
              WHERE open_cases.caseoffice_id = caseoffice.id
      ),
      'Average cases per officer', (
              SELECT n
              FROM metric_avg_open_cases_per_active_user avg_cases
              WHERE avg_cases.caseoffice_id = caseoffice.id
      ),
      'Average days per case', (
              SELECT n + 1
              FROM metric_avg_days_per_case avg_days
              WHERE avg_days.caseoffice_id = caseoffice.id
      ),
      'Cases opened', (
              SELECT n
              FROM metric_cases_opened AS opened
              WHERE opened.caseoffice_id = caseoffice.id
      ),
      'Cases closed', (
              SELECT n
              FROM metric_cases_closed AS closed
              WHERE closed.caseoffice_id = caseoffice.id
      )
  )
)
FROM
	case_management_caseoffice AS caseoffice
{case_office_filter(case_office)};"""

def daily_summary(start_month, end_month, case_office=None):
    return f"""
WITH
  months AS (
  	SELECT
  		DATE_TRUNC('month', months_series)::date AS MONTH,
  		(
  			DATE_TRUNC('month', months_series) + INTERVAL '1 month' - INTERVAL '1 day'
  		)::date month_end
  	FROM
  		generate_series(
      '{start_month}'::timestamp,
      '{end_month}'::timestamp,
      '1 month'::INTERVAL
  ) months_series
  ),
  days AS (
  	SELECT
  		DATE_TRUNC('day', days_series)::date AS DAY
  	FROM
  		generate_series(
      '{start_month}'::timestamp,
      '{end_month}'::timestamp + '1 month - 1 day',
      '1 day'::INTERVAL
  ) days_series
  ),
  metric_cases_created AS (
  	SELECT
  		case_office.caseoffice_id,
  		DATE_TRUNC('day', legalcase.created_at)::date AS DAY,
  		COUNT(legalcase.id) n
  	FROM
  		case_management_legalcase legalcase,
  		case_management_legalcase_case_offices case_office
  	WHERE
  		legalcase.id = case_office.legalcase_id
  	GROUP BY
  		case_office.caseoffice_id,
  		DAY
  ),
  metric_cases_closed AS (
  	SELECT
  		case_office.caseoffice_id,
  		DATE_TRUNC('day', log.created_at)::date AS DAY,
  		COUNT(logchange.id) n
  	FROM
  		case_management_logchange logchange
  	INNER JOIN case_management_log log ON
  		log.id = logchange.log_id
  	INNER JOIN case_management_legalcase legalcase ON
  		legalcase.id = log.target_id
  	INNER JOIN case_management_legalcase_case_offices case_office ON
  		case_office.legalcase_id = legalcase.id
  	WHERE
  		logchange.field = 'state'
  		AND logchange.value = 'Closed'
  	GROUP BY
  		case_office.caseoffice_id,
  		DAY
  ),
  metric_updates AS (
  	SELECT
  		case_office.caseoffice_id,
  		DATE_TRUNC('day', log.created_at)::date AS DAY,
  		COUNT(log.id) n
  	FROM
  		case_management_log log
  	INNER JOIN case_management_legalcase legalcase ON
  		legalcase.id = log.target_id
  	INNER JOIN case_management_legalcase_case_offices case_office ON
  		case_office.legalcase_id = legalcase.id
  	GROUP BY
  		case_office.caseoffice_id,
  		DAY
  )
SELECT
	json_object_agg(
    name, json_build_object(
      'Cases opened', (
        SELECT json_object_agg(
            to_char(months.month, 'YYYY-MM'), (
                SELECT json_agg(
                    json_build_object(
                        'date', days.day,
                        'value', (
                            SELECT n
                            FROM metric_cases_created cases_created
                            WHERE cases_created.caseoffice_id = caseoffice.id AND cases_created.day = days.day
                        )
                    )
                )
                FROM days
                WHERE days.day BETWEEN months.month AND months.month_end
            )
        )
        FROM months
      ),
      'Cases closed', (
        SELECT json_object_agg(
            to_char(months.month, 'YYYY-MM'), (
                SELECT json_agg(
                    json_build_object(
                        'date', days.day,
                        'value', (
                            SELECT n
                            FROM metric_cases_closed cases_closed
                            WHERE cases_closed.caseoffice_id = caseoffice.id AND cases_closed.day = days.day
                        )
                    )
                )
                FROM days
                WHERE days.day BETWEEN months.month AND months.month_end
            )
        )
        FROM months
      ),
      'Cases with activity', (
        SELECT json_object_agg(
            to_char(months.month, 'YYYY-MM'), (
                SELECT json_agg(
                    json_build_object(
                        'date', days.day,
                        'value', (
                            SELECT n
                            FROM metric_updates updates
                            WHERE updates.caseoffice_id = caseoffice.id AND updates.day = days.day
                        )
                    )
                )
                FROM days
                WHERE days.day BETWEEN months.month AND months.month_end
            )
        )
        FROM months
      )
    )
)
FROM
	case_management_caseoffice AS caseoffice
{case_office_filter(case_office)};"""


def monthly_summary(start_month, end_month, case_office=None):
    return f"""
WITH
  months AS (
  	SELECT
  		date_trunc('month', months_series)::date AS MONTH,
  		(
  			date_trunc('month', months_series) + INTERVAL '1 month' - INTERVAL '1 day'
  		)::date month_end
  	FROM
  		generate_series(
      '{start_month}'::timestamp,
      '{end_month}'::timestamp,
      '1 month'::INTERVAL
  ) months_series
  ),
  legalcase_open_close AS (
  	{LEGALCASE_OPEN_CLOSE}
  ),
  legalcase_open_close_days AS (
  	{LEGALCASE_OPEN_CLOSE_DAYS}
  ),
  legalcase_detail_by_caseoffice AS (
  	{LEGALCASE_DETAIL_BY_CASEOFFICE}
  ),
  metric_cases_opened AS (
  	SELECT
  		legalcase.caseoffice_id,
  		months.month,
  		COUNT(id) n
  	FROM
  		legalcase_detail_by_caseoffice legalcase,
  		months
  	WHERE
  		legalcase.created_at BETWEEN months.month AND months.month_end
  	GROUP BY
  		legalcase.caseoffice_id,
  		months.month
  ),
  metric_cases_closed AS (
  	SELECT
  		legalcase.caseoffice_id,
  		months.month,
  		COUNT(id) n
  	FROM
  		legalcase_detail_by_caseoffice legalcase,
  		months
  	WHERE
  		legalcase.closed_at BETWEEN months.month AND months.month_end
  	GROUP BY
  		legalcase.caseoffice_id,
  		months.month
  ),
  metric_open_cases AS (
  	SELECT
  		legalcase.caseoffice_id,
  		months.month,
  		COUNT(id) n
  	FROM
  		legalcase_detail_by_caseoffice legalcase,
  		months
  	WHERE
  		legalcase.created_at <= months.month_end
  		AND (
  			legalcase.closed_at IS NULL
  				OR legalcase.closed_at >= months.month_end
  		)
  	GROUP BY
  		legalcase.caseoffice_id,
  		months.month
  ),
  active_users_by_caseoffice AS (
  	SELECT
  		users.case_office_id,
  		users.name,
  		DATE_TRUNC('month', log.created_at)::date AS MONTH
  	FROM
  		case_management_log AS log,
  		case_management_user AS users
  	WHERE
  		log.user_id = users.id
  	GROUP BY
  		users.case_office_id,
  		users.name,
  		MONTH
  ),
  metric_active_users AS (
  	SELECT
  		case_office_id,
  		MONTH,
  		COUNT(name) AS n
  	FROM
  		active_users_by_caseoffice
  	GROUP BY
  		case_office_id,
  		MONTH
  ),
  metric_avg_open_cases_per_active_user AS (
  	SELECT
  		open_cases.caseoffice_id,
  		open_cases.month,
  		open_cases.n / active_users.n n
  	FROM
  		metric_open_cases open_cases,
  		metric_active_users active_users
  	WHERE
  		open_cases.caseoffice_id = active_users.case_office_id
  		AND open_cases.month = active_users.month
  ),
  metric_avg_days_per_case AS (
  	SELECT
  		legalcase.caseoffice_id,
  		months.month,
  		legalcase.days_created_to_closed n
  	FROM
  		legalcase_detail_by_caseoffice legalcase,
  		months
  	WHERE
  		legalcase.closed_at BETWEEN months.month AND months.month_end
  	GROUP BY
  		legalcase.caseoffice_id,
  		months.month,
  		legalcase.days_created_to_closed
  )
SELECT
	json_object_agg(
    name, json_build_object(
      'Active case officers', (
          SELECT json_agg(
              json_build_object(
                  'date', to_char(months.month, 'YYYY-MM'),
                  'value', (
                      SELECT n
                      FROM metric_active_users active_users
                      WHERE active_users.case_office_id = caseoffice.id AND active_users.month = months.month
                  )
              )

           )
          FROM months
      ),
      'Total cases', (
          SELECT json_agg(
              json_build_object(
                  'date', to_char(months.month, 'YYYY-MM'),
                  'value', (
                      SELECT n
                      FROM metric_open_cases open_cases
                      WHERE open_cases.caseoffice_id = caseoffice.id AND open_cases.month = months.month
                  )
              )

           )
          FROM months
      ),
      'Average cases per officer', (
          SELECT json_agg(
              json_build_object(
                  'date', to_char(months.month, 'YYYY-MM'),
                  'value', (
                      SELECT n
                      FROM metric_avg_open_cases_per_active_user avg_cases
                      WHERE avg_cases.caseoffice_id = caseoffice.id AND avg_cases.month = months.month
                  )
              )

           )
          FROM months
      ),
      'Average days per case', (
          SELECT json_agg(
              json_build_object(
                  'date', to_char(months.month, 'YYYY-MM'),
                  'value', (
                      SELECT n + 1
                      FROM metric_avg_days_per_case avg_days
                      WHERE avg_days.caseoffice_id = caseoffice.id AND avg_days.month = months.month
                  )
              )

           )
          FROM months
      ),
      'Cases opened', (
          SELECT json_agg(
              json_build_object(
                  'date', to_char(months.month, 'YYYY-MM'),
                  'value', (
                      SELECT n
                      FROM metric_cases_opened AS opened
                      WHERE opened.caseoffice_id = caseoffice.id AND opened.month = months.month
                  )
              )

           )
          FROM months
      ),
      'Cases closed', (
          SELECT json_agg(
              json_build_object(
                  'date', to_char(months.month, 'YYYY-MM'),
                  'value', (
                      SELECT n
                      FROM metric_cases_closed AS closed
                      WHERE closed.caseoffice_id = caseoffice.id AND closed.month = months.month
                  )
              )

           )
          FROM months
      )
    )
)
FROM
	case_management_caseoffice AS caseoffice
{case_office_filter(case_office)};"""
