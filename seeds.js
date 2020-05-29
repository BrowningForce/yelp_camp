const mongoose   = require('mongoose'),
      Comment    = require('./models/comment'),
      Campground = require('./models/campground');

const seeds = [
    {
        name: 'Camping Heaven',
        image: 'https://images.unsplash.com/photo-1559521783-1d1599583485?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: `Spicy jalapeno bacon ipsum dolor amet landjaeger beef ribs meatloaf, burgdoggen frankfurter buffalo brisket pastrami sausage sunt adipisicing culpa. 
                      Cupim short loin tail pork loin, prosciutto in ipsum. Dolor mollit sint nostrud et lorem spare ribs jowl flank shankle ribeye burgdoggen fatback enim.`
    },
    {
        name: 'Clear Sky',
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: `Enim ipsum alcatra in chuck. Laboris porchetta do, prosciutto pork beef ribs alcatra boudin chuck fatback pastrami ribeye ullamco veniam tongue. Ut bresaola 
                      ham hock drumstick, fatback dolore shank. In pork chop kevin bresaola tongue, quis excepteur beef ut veniam esse ham jerky beef ribs shoulder.`
    },
    {
        name: 'Mountain Lake',
        image: 'https://images.unsplash.com/photo-1571863533956-01c88e79957e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        description: `Nostrud sunt dolore tongue, short loin pork drumstick tail burgdoggen jerky irure landjaeger beef ribs venison et. Non quis consequat beef. 
                      Voluptate cupidatat dolore dolor turducken lorem proident pork belly, meatball irure aute picanha leberkas elit beef ribs.`
    },
]

async function seedDB() {
    try {
        //remove campgrounds and comments
        await Campground.deleteMany({});
        await Comment.deleteMany({});

        //add campgrounds
        for (const seed of seeds) {
            const campground = await Campground.create(seed);
            const comment = await Comment.create({
                text: 'Nice, but no Wi-Fi',
                author: 'Homer'
            });
            campground.comments.push(comment);
            campground.save();
        }
    } catch (err) {
        console.log(err);
    }

}

module.exports = seedDB;