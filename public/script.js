document.addEventListener('DOMContentLoaded', () => {
    const orderForm = document.getElementById('orderForm');
    const orderFormContainer = $('#orderFormContainer');

    // Отправка формы
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const date = document.getElementById('date').value;
        const kol = document.getElementById('kol').value;
        const sum = document.getElementById('sum').value;
        const stop = document.getElementById('stop').value || 300;
        const desc = document.getElementById('desc').value || "";

        fetch('/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, kol, sum, stop, desc })
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                loadOrders();
                orderFormContainer.modal('hide');
            });
    });

// Загрузка заказов
function loadOrders() {
    fetch('/orders')
        .then(response => response.json())
        .then(data => {
            const ordersListContainer = document.getElementById('ordersList');
            ordersListContainer.innerHTML = '';

            // Группировка заказов по датам
            const groupedOrders = data.reduce((acc, order) => {
                (acc[order.date] = acc[order.date] || []).push(order);
                return acc;
            }, {});

            // Итерация по группам заказов
            Object.keys(groupedOrders).forEach(date => {
                // Создание контейнера для группы заказов
                const dateGroup = document.createElement('div');

                // Создание заголовка с датой
                const dateHeader = document.createElement('li');
                dateHeader.className = 'list-group-item active';
                dateHeader.textContent = date;
                
                // Создание списка для заказов
                const ordersList = document.createElement('ul');
                ordersList.className = 'list-group mb-3';
                ordersList.appendChild(dateHeader);

                // Итерация по заказам для данной даты
                groupedOrders[date].forEach((order, index) => {
                    // Создание элемента списка для каждого заказа
                    const orderItem = document.createElement('li');
                    orderItem.className = 'order-item list-group-item d-flex justify-content-between align-items-center';

                    // Основная информация о заказе
                    const orderInfo = document.createElement('div');
                    orderInfo.className = 'd-flex align-items-center';
                    orderInfo.innerHTML = `
                        <span class="btn btn-primary">${order.kol}</span>
                        <span style="padding-left: 10px;">${order.sum} SEK</span>
                    `;

                    // Кнопка для отображения деталей
                    const detailsButton = document.createElement('button');
                    detailsButton.className = 'btn btn-outline-primary';
                    detailsButton.type = 'button';
                    detailsButton.setAttribute('data-bs-toggle', 'collapse');
                    detailsButton.setAttribute('data-bs-target', `#details${date}-${index}`);
                    detailsButton.textContent = 'Details';

                    // Добавление элементов в элемент списка
                    orderItem.appendChild(orderInfo);
                    orderItem.appendChild(detailsButton);
                    ordersList.appendChild(orderItem);

                    // Детали заказа
                    const orderDetails = document.createElement('div');
                    orderDetails.id = `details${date}-${index}`;
                    orderDetails.className = 'collapse';
                    orderDetails.innerHTML = `
                        <div class="p-3">
                            <p class="mb-0">${order.desc}</p>
                            <p class="mb-0">Stop: ${order.stop}</p>
                        </div>
                    `;
                    ordersList.appendChild(orderDetails);
                });

                // Добавление группы заказов в контейнер
                dateGroup.appendChild(ordersList);
                ordersListContainer.appendChild(dateGroup);
            });
        })
        .catch(error => console.error('Error loading orders:', error));
}


    // Показ и скрытие формы
    function showForm() {
        orderFormContainer.modal('show');
    }

    function hideForm() {
        orderFormContainer.modal('hide');
    }

    document.getElementById('showFormBtn').addEventListener('click', showForm);
    document.getElementById('cancelFormBtn').addEventListener('click', hideForm);
    document.getElementById('addOrderBtn').addEventListener('click', showForm);

    loadOrders();
});
