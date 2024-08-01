import json
import psycopg2
from datetime import datetime

# Функция для преобразования формата даты
def convert_date(date_str, year):
    try:
        # Создаем дату с указанным годом
        date_with_year = f"{date_str}.{year}"
        return datetime.strptime(date_with_year, "%d.%m.%Y").strftime("%Y-%m-%d")
    except ValueError:
        return None

# Укажите текущий год или любой другой год
current_year = 2024

# Подключение к базе данных
conn = psycopg2.connect(
    dbname='verceldb',
    user='default',
    password='w9UuYScFEy3M',
    host='ep-spring-dream-58410209.eu-central-1.aws.neon.tech',
    port='5432'
)
cursor = conn.cursor()

# Создайте таблицу (если она ещё не создана)
cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        kol INT NOT NULL,
        sum INT NOT NULL,
        stop INT NOT NULL,
        "desc" TEXT
    );
""")
conn.commit()

# Загрузите данные из JSON файла
with open('orders.json') as file:
    data = json.load(file)

# Подготовка данных для вставки
for date_str, orders in data.items():
    # Преобразование формата даты
    order_date = convert_date(date_str, current_year)
    if order_date:
        for order in orders:
            kol = order.get('kol', 0)
            sum = order.get('sum', 0)
            stop = order.get('stop', 300)
            desc = order.get('desc', '')

            cursor.execute("""
                INSERT INTO orders (date, kol, sum, stop, "desc")
                VALUES (%s, %s, %s, %s, %s);
            """, (order_date, kol, sum, stop, desc))

conn.commit()
cursor.close()
conn.close()
