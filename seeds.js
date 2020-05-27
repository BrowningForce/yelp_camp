const mongoose   = require('mongoose'),
      Comment    = require('./models/comment'),
      Campground = require('./models/campground');

const seeds = [
    {
        name: 'Camping Heaven',
        image: 'https://pixabay.com/get/53e4dd434850b10ff3d8992cc62e3778153bd6ec4e50744075297bd6904bc1_640.jpg',
        description: `Spicy jalapeno bacon ipsum dolor amet landjaeger beef ribs meatloaf, burgdoggen frankfurter buffalo brisket pastrami sausage sunt adipisicing culpa. 
                      Cupim short loin tail pork loin, prosciutto in ipsum. Dolor mollit sint nostrud et lorem spare ribs jowl flank shankle ribeye burgdoggen fatback enim.`
    },
    {
        name: 'Clear Sky',
        image: 'https://pixabay.com/get/57e8d1464352aa14f1dc84609629317e133fdaed5a4c704c7c2f7dd4954ac35c_640.jpg',
        description: `Enim ipsum alcatra in chuck. Laboris porchetta do, prosciutto pork beef ribs alcatra boudin chuck fatback pastrami ribeye ullamco veniam tongue. Ut bresaola 
                      ham hock drumstick, fatback dolore shank. In pork chop kevin bresaola tongue, quis excepteur beef ut veniam esse ham jerky beef ribs shoulder.`
    },
    {
        name: 'Mountain Lake',
        image: 'https://pixabay.com/get/57e8d0424a5bae14f1dc84609629317e133fdaed5a4c704c7c2f7dd4954ac35c_640.jpg',
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