const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant');

mongoose.connect('mongodb://localhost:27017/food-finder', {
    useNewUrlParser: true,
    useUnifiedTopology: true

});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Restaurant.deleteMany({});

    let rest = new Restaurant({
        title: "George's Place",
        location: 'Orfeos 35, Galatsi, Athens',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80'
            }
        ],
        geometry: {
            type: "Point",
            coordinates: [23.744582, 38.018827]
        },
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque porta eleifend faucibus. Maecenas suscipit nisi eget odio faucibus pellentesque.',
        price: 12,
        author: '619ba0c05e0e76b3149c9483'
    })
    await rest.save();

    rest = new Restaurant({
        title: "Best Souvlaki",
        location: 'Zefirou 20, Peristeri, Athens',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=685&q=80'
            }
        ],
        geometry: {
            type: "Point",
            coordinates: [23.6867256873974, 38.01000357960911]
        },
        description: 'Praesent elit ante, sollicitudin ut augue vel, volutpat interdum tellus. Nullam at sem consectetur, fringilla nisl in, tristique enim.',
        price: 15,
        author: '619ba0c05e0e76b3149c9483'
    })
    await rest.save();

    rest = new Restaurant({
        title: "Ciao Italia",
        location: 'Solomou 102, Moschato, Athens',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1502301103665-0b95cc738daf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'
            }
        ],
        geometry: {
            type: "Point",
            coordinates: [23.682580126307812, 37.950048530239805]
        },
        description: 'Integer neque magna, cursus nec neque vitae, vehicula dignissim nunc. Suspendisse libero nunc, ultricies nec felis id, dictum accumsan tellus.',
        price: 9,
        author: '619ba0c05e0e76b3149c9483'
    })
    await rest.save();

    rest = new Restaurant({
        title: "Kokoretsi time",
        location: 'Athinon 69, Lamia',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1171&q=80'
            }
        ],
        geometry: {
            type: "Point",
            coordinates: [22.4385672826537, 38.89108254289056]
        },
        description: 'Quisque malesuada auctor mi, in blandit mauris vestibulum id. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
        price: 18,
        author: '619ba0c05e0e76b3149c9483'
    })
    await rest.save();

    rest = new Restaurant({
        title: "Babis",
        location: 'Karaiskaki 128, Lamia',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1508424757105-b6d5ad9329d0?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=735&q=80'
            }
        ],
        geometry: {
            type: "Point",
            coordinates: [22.430136384500255, 38.908857794912116]
        },
        description: 'Proin leo enim, auctor ac ligula sit amet, maximus mattis nisi. Aliquam sit amet metus fringilla, pretium magna ac, sagittis nisl.',
        price: 16,
        author: '619ba0c05e0e76b3149c9483'
    })
    await rest.save();

}

seedDB().then(() => {
    mongoose.connection.close();
});