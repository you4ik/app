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
                const ordersList = document.getElementById('ordersList');
                ordersList.innerHTML = '';
                data.forEach(order => {
                    const orderElement = document.createElement('div');
                    orderElement.className = 'order-item';
                    orderElement.textContent = `${order.date} - Kol: ${order.kol}, Sum: ${order.sum}, Stop: ${order.stop}, Desc: ${order.desc}`;
                    ordersList.appendChild(orderElement);
                });
            });
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
