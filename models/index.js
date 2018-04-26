const Sequelize = require('sequelize');
//where our db lives
const db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false,
});

const Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        unique: true

    },
    urlTitle: {
        type: Sequelize.STRING,
        allNull: false

    },
    content: {
        type: Sequelize.TEXT,
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    }
}, {
    hooks: {},
    getterMethods: {
        route: function () {
            return "/wiki/" + this.urlTitle

        }
    }

})

//HOOKS FOR PAGE
//MAKES A URL, BEFORE VALIDATING  THE ROW THAT WILL BE ADDED TO PAGES TABLE
Page.beforeValidate((pageInstance) => {
    getURL(pageInstance);
})

//Generate URL
function getURL(instance) {
    if (instance.title) {
        let title = instance.getDataValue('title');
        const urlTitleCreated = title.replace(/\s+/g, '_').replace(/\W/g, '');
        instance.urlTitle = urlTitleCreated;

    } else instance.urlTitle = Math.random().toString(36).substring(2, 7);

}

//USER TABLE
const User = db.define('user', {
    name: {
        type: Sequelize.STRING,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
});




module.exports = {
    Page: Page,
    User: User,
    db: db,
}
