"""
	EXPLORE Data Science Academy

	Example Apache Airflow DAG script. For more context, consult the 
	associated train content
"""

# -------------------------
# PART 1: IMPORTING MODULES
# -------------------------

import airflow
from airflow import DAG
from datetime import timedelta
from airflow.operators.bash_operator import BashOperator
from airflow.operators.postgres_operator import PostgresOperator

# -----------------------------------------------------
# PART 2: SET UP DEFAULT ARGUMENTS AND INSTANTIATE DAG
# -----------------------------------------------------

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': airflow.utils.dates.days_ago(1),
    'email': ['airflow@example.com'],
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5)
    }

dag = DAG(
        'airflow_data_pipeline_tutorial',
        default_args=default_args,
        schedule_interval='@daily',
        template_searchpath='/usr/local/airflow/include/sqldb/'
     )

# ---------------------
# PART 3: DEFINE TASKS
# ---------------------

t1 = PostgresOperator(
task_id='create_table',
postgres_conn_id='my_postgres_connection',
sql='CREATE TABLE my_table (my_column varchar(10));',
dag=dag,
)

t2 = BashOperator(
task_id = 'bash_hello_world',
bash_command = 'echo "Hello World"',
dag=dag
)

# ----------------------------
# PART 4: DEFINE DEPENDENCIES
# ----------------------------

# t1 ───> t2 

# Using the set_downstream() function
t1.set_downstream(t2)

# We perform the same dependence mapping, but in a different way.
# This is called the bit shift operator
t1 >> t2 # We can use left to right assignment...  
t2 << t1 # Or right to left assignment - both produce the same result. 
