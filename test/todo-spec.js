var countPublicObjects = function(message) {
    var before = message.indexOf(' are ') + ' are '.length;
    var after = message.indexOf(' public ');
    return parseInt(message.substring(before, after));
};

describe('sample-app: ', function() {
  it('should let users signup', function() {
    browser.get('http://localhost:3000');
    expect(browser.getTitle()).toEqual('Sample app');

    element(by.id('signup-button')).click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/register');

    element(by.id('name')).sendKeys('test');
    element(by.id('email')).sendKeys('test@test.com');
    element(by.id('password')).sendKeys('test');
    element(by.id('confirm-password')).sendKeys('test');
    element(by.css('.submit-button')).click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/objects');
    // checking that the growl notif is here
    expect(element(by.css('.alert-success')).isPresent()).toBe(true);
  });

  it('should let users logout', function() {
    element(by.id('dropdown-button')).click();
    element(by.id('logout-button')).click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/');
    });

  it('should let users login', function() {
    element(by.id('login-button')).click();
    element(by.id('name')).sendKeys('test');
    element(by.id('password')).sendKeys('test');
    element(by.css('.submit-button')).click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/objects');
    });

  it('should let users create objects', function() {
    expect(element(by.id('privateObjectsCounter')).getText()).toEqual('You have 0 objects');
    element(by.model('objectName')).sendKeys('testObject');
    element(by.id('submit-button')).click();
    expect(element(by.id('privateObjectsCounter')).getText()).toEqual('You have 1 objects');
    expect(element(by.css('.objectName')).getText()).toEqual('testObject');
  });

  it('should let users publish objects', function() {
    element(by.id('publicObjectsCounter')).getText().then(function(value) {
        var numberOfPublicObjects = countPublicObjects(value);
        element(by.css('.publish')).click();
        // the length of the public objects list should have increased
        element(by.id('publicObjectsCounter')).getText().then(function(value) {
            expect(countPublicObjects(value)).toEqual(numberOfPublicObjects + 1);
            // the element of the list which has 'test' as author should have 'testObject' as object name
            expect(element(by.cssContainingText('.author', 'test')).element(by.binding('publicObject.name')).getText()).toEqual('testObject');
        });
    });
  });

  it('should let users delete objects', function() {
    element(by.id('publicObjectsCounter')).getText().then(function(value) {
        var numberOfPublicObjects = countPublicObjects(value);
        element(by.css('.remove')).click();
        // the length of the public objects list should have decreased
        element(by.id('publicObjectsCounter')).getText().then(function(value) {
            expect(countPublicObjects(value)).toEqual(numberOfPublicObjects - 1);
        });
    });
  });

  it('should let users change their passwords', function() {
    element(by.id('dropdown-button')).click();
    element.all(by.css('.dropdown-menu li')).first().click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/profile');

    element(by.id('password-update')).click();
    element(by.id('password-for-password')).sendKeys('test');
    element(by.id('new-password')).sendKeys('testy');
    element(by.id('confirm-new-password')).sendKeys('testy');
    element(by.id('password-submit')).click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/profile');
    expect(element(by.css('.alert-success')).isPresent()).toBe(true);
    browser.waitForAngular();

    // let's log out and in again with the new password
    element(by.id('dropdown-button')).click();
    element(by.id('logout-button')).click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/');

    element(by.id('login-button')).click();
    element(by.id('name')).sendKeys('test');
    element(by.id('password')).sendKeys('testy');
    element(by.css('.submit-button')).click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/objects');
    });

  it('should let users change their emails', function() {
    element(by.id('dropdown-button')).click();
    element.all(by.css('.dropdown-menu li')).first().click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/profile');

    element(by.id('email-update')).click();
    element(by.id('email')).sendKeys('testy@testy.com');
    element(by.id('password-for-email')).sendKeys('testy');
    element(by.id('email-submit')).click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/profile');
    expect(element(by.css('.alert-success')).isPresent()).toBe(true);
    expect(element(by.id('email-update')).getText()).toEqual('testy@testy.com');
    });

  it('should let users delete their accounts', function() {
    element(by.id('account-deletion')).click();
    element(by.id('password-for-account-deletion')).sendKeys('testy');
    element(by.id('account-deletion-submit')).click();
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/');
    expect(element(by.css('.alert-success')).isPresent()).toBe(true);
    });
});