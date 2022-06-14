console.log('Socket UI')

const socket = io.connect();

const renderMessages = (data) => {
    const html = data.map((element, index) => {
        return (`
        <li class="mb-10 ml-6">
            <span class="flex absolute -left-3 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900">
                <img class="rounded-full shadow-lg" src="/docs/images/people/profile-picture-5.jpg" alt="Thomas Lean image"/>
            </span>
            <div class="p-4 bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-gray-700 dark:border-gray-600">
                <div class="justify-between items-center mb-3 sm:flex">
                    <div class="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">${element.date} </div>
                    <div class="text-sm font-normal text-gray-500 lex dark:text-gray-300">${element.author} commented</div>
                </div>
                <div class="p-3 text-xs italic font-normal text-gray-500 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">${element.text}</div>
            </div>
        </li>
        `)
    }).join(' ')
    document.querySelector('.messageCenter .messages').innerHTML = html
}

const renderProductos = (data) => {
    console.log("AAAAAA", data)
    const html = data.map((element, index) => {
        return (`
        <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                ${element.name}
            </th>
            <td class="px-6 py-4">
                ${element.color}
            </td>
            <td class="px-6 py-4">
                ${element.category}
            </td>
            <td class="px-6 py-4">
                $${element.price}
            </td>
            <td class="px-6 py-4 text-right">
                <a href="#" class="font-medium text-blue-600 dark:text-blue-500 hover:underline hidden">Edit</a>
            </td>
        </tr>
        `)
    }).join(' ')
    document.querySelector('.productList .productItems').innerHTML = html
}

socket.on('messages', (messages) => {
  console.log(messages);
  renderMessages(messages);
})

socket.on('products', (products) => {
    renderProductos(products);
})
  

const addMessage = () => {
    const message = {
      author: document.querySelector('.messageCenter #email').value,
      text: document.querySelector('.messageCenter #message').value,
      date: moment().format('MMMM Do YYYY, h:mm:ss a')
    };
    socket.emit('new-message', message);
    return false
}

const addProduct = (item) => {
    const product = {
        name: document.querySelector('.productEntry #product-name').value || "",
        color: document.querySelector('.productEntry #colors').value || "",
        category: document.querySelector('.productEntry #category').value || "",
        price: document.querySelector('.productEntry #price').value || 0
    };
    postProduct(product);
    return false
}

const formMessage = document.querySelector('.messageCenter form');
formMessage.addEventListener('submit', (event)=>{
    event.preventDefault();
    addMessage();
})

const formProducts = document.querySelector('.productEntry form');
formProducts.addEventListener('submit', (event)=>{
    event.preventDefault();
    addProduct();
})

async function postProduct(product) {
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product)
    }

    const response = await fetch('/api/productos/', config);
    if (response.ok) {
        socket.emit('new-product', product);
    } 
}


async function fetchProducts() {
    try {
        const response = await fetch('/api/productos/', {mode: 'no-cors'});
        if (response.ok) {
            const data = await response.json();
            // renderProductos(data);
            data.map(element => {
                socket.emit('new-product', element);
            })
            return data;
        }
    } catch (error) {
        console.log(error)
    }
}

fetchProducts();