var items = new Mongo.Collection('items');
var colors = ['red', 'blue', 'green', 'purple'];

var getSortIndex = function(prevCardDomElement, nextCardDomElement) {
  // If we drop the card to an empty column
  if (! prevCardDomElement && ! nextCardDomElement) {
    return 0;
  // If we drop the card in the first position
  } else if (! prevCardDomElement) {
    return Blaze.getData(nextCardDomElement).sort - 1;
  // If we drop the card in the last position
  } else if (! nextCardDomElement) {
    return Blaze.getData(prevCardDomElement).sort + 1;
  }
  // In the general case take the average of the previous and next element
  // sort indexes.
  else {
    var prevSortIndex = Blaze.getData(prevCardDomElement).sort;
    var nextSortIndex = Blaze.getData(nextCardDomElement).sort;
    return (prevSortIndex + nextSortIndex) / 2;
  }
};

if (Meteor.isClient) {
  Template.items.helpers({
    items: function () {
      return items.find({}, {sort: ['sort']});
    }
  });

  Template.items.onRendered(function() {
    dragula(this.find('#container'))
      .on('drop', function(el) {
        var itemId = Blaze.getData(el)._id;
        var newSortIndex = getSortIndex(el.previousElementSibling, el.nextElementSibling);
        items.update(itemId, {$set: {sort: newSortIndex}});
      });
  });

  Template.colors.helpers({
    colors: colors
  });

  Template.colors.onRendered(function() {
    dragula(this.find('.colors'), {
      copy: true
    }).on('drop', function(el) {
      console.log(this);
    });
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if (items.find().count() === 0) {
      _.each(['maxime', 'elodie', 'pilou', 'maman', 'papa'], function(name, i) {
        items.insert({name: name, sort: i});
      });
    }
  });
}
