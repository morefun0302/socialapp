var log = Alloy.Globals.log;
var tag = '[NAV]';
var slideAnimTime = 120;
var Anim = require('core/Anim');

function Navigation(_initParams) {

    var display,
    menu,
    main,
    menuButton,
    backButton,
    container,
    isMenuOpen = false,
    hold = false, // flag mechanism to prevent a page being opened multiple times before an animation is complete
    history = [{controller : 'welcome'}];

    function init(opts) {
        display = opts.display;
        main = opts.main;
        menuButton = opts.menuButton;
        backButton = opts.backButton;
        menu = opts.menu;
        container = opts.container;

        log.write('Navigation is initialized.', tag);
    }

    function menuOpen() {
        isMenuOpen = true;
        return Anim.slideToRight({
            percent : parseInt(50),
            view : main,
            duration : slideAnimTime
        });
    }

    function menuClose() {
        isMenuOpen = false;
        return Anim.slideToLeft(main, slideAnimTime);
    }

    function menuToggle() {
        if (isMenuOpen) {
            menuClose();
        } else {
            menuOpen();
        }
    }

    function addToHistory(opts) {
        var tag = '[HISTORY]';

        var page = {
            controller : opts.controller,
            arguments : opts.arguments,
            group : opts.group
        };

        if (!pageEqualsLast(page)) {
            history.push(page);
            log.write(' + ' + JSON.stringify({contoller:page.controller, group:page.group}), tag);
            return true;
        }

        return false;
    }

    //will validate navigation's bar real state. Will show back or menu button
    function validateState() {
        var isBackVisible = history.length > 1;
        var fadeInButton = isBackVisible ? backButton : menuButton;
        var fadeOutButton = !isBackVisible ? backButton : menuButton;
        fadeOutButton.setVisible(false);
        fadeInButton.setVisible(true);
    }

    function pageEqualsLast(page) {
        if (history.length > 0) {
            var last = _.last(history);
            return last.controller === page.controller;
        } else {
            return false;
        }

    }

    function lastPageBelongsToGroup(groupName) {
        var last = _.last(history);
        return last && last.group && last.group === groupName;
    }

    function pop() {
        var tag = '[HISTORY]';
        var page = history.pop();
        log.write(' - ' + JSON.stringify({contoller:page.controller, group:page.group}), tag);
        var EventDispatcher = Alloy.Globals.EventDispatcher;
        EventDispatcher.trigger(EventDispatcher.get('Events').PAGE_CLOSED, {
            controller : page.contoller
        });
        return page;
    }

    function getLastPage() {
        return _.last(container.getChildren());
    }

    function openPage(opts) {
    	
        if (!addToHistory(opts) || hold) {
            return;
        }

        hold = true;
        var isRootView = history.length === 1;

        menuClose().then(function() {
        	var view;
        	if (opts.controller == 'survey' && Alloy.Globals.surveyView != null) {
        		view = Alloy.Globals.surveyView;
        	} else {
        		view = Alloy.createController(opts.controller, opts.arguments).getView();		
        	}
            var EventDispatcher = Alloy.Globals.EventDispatcher;
            EventDispatcher.trigger(EventDispatcher.get('Events').PAGE_OPENED, {
                controller : opts.controller
            });
            Alloy.Globals.ga.clearTab();
            if (!isRootView) {
                view.left = '100%';
                view.right = '-100%';
            }
            container.add(view);
            validateState();
            if (!isRootView) {
                return Anim.slideToLeft(view, slideAnimTime);
            }
        }).then(function() {
            hold = false;
        }).done();
    }

    function popPage(fireFocusOnPrevious, noAnimation) {
        var page = pop();
        var lastPage = getLastPage();
        
        if (page.controller == 'survey') {
        	Alloy.Globals.surveyView = lastPage;
        }

        function removeFromParent() {
            validateState();
            if (lastPage)
            	container.remove(lastPage);
            if (fireFocusOnPrevious) {
                refresh();
            }
        }

        if (!noAnimation) {
            Anim.slideToRight({
                view : lastPage,
                duration : slideAnimTime
            }).then(removeFromParent).done();
        } else {
            removeFromParent();
        }
    }

    function setFirstView(opts) {
        reset();
        openPage(opts);
    }

    function toggle() {
        menuToggle();
    }

    function goBack() {
        if (history.length > 1) {
            popPage(true, false);
        } else {
        	var EventDispatcher = Alloy.Globals.EventDispatcher;
            EventDispatcher.trigger(EventDispatcher.get('Events').APP_EXIT);
        }
    }

    function refresh() {
        var last = getLastPage();
        if (last) {
            last.fireEvent('focus', {});
        }
    }

    function closeGroup(groupName, callback) {
        while (lastPageBelongsToGroup(groupName)) {
            popPage(false, true);
        }
        refresh();
        validateState();
        if (callback) {
            callback();
        }
    }

    function isOnWebOrdering() {
        return lastPageBelongsToGroup(groups.ORDERING);
    }

    function reset() {
        while (history.length > 0) {
            popPage(false, true);
        }
    }

    function getOpenPageId() {
        return _.last(history).controller;
    }

    var groups = {
        LOGIN : 1,
        SIGNUP : 2
    };

    init(_initParams);

    return {
        setView : openPage,
        setFirstView : setFirstView,
        getOpenPageId : getOpenPageId,
        toggle : toggle,
        goBack : goBack,
        refresh : refresh,
        closeGroup : closeGroup,
        isOnWebOrdering: isOnWebOrdering,
        reset : reset,
        GROUPS : groups
    };
}

module.exports = Navigation;
