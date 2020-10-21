/* eslint-disable */
const rootURL = 'http://localhost:3000/';
// const rootURL = 'https://alpha.sailplane.io/';


describe('Private drive management', () => {
  before(() => {
    window.indexedDB.databases().then((r) => {
      for (var i = 0; i < r.length; i++)
        window.indexedDB.deleteDatabase(r[i].name);
    });
  });

  beforeEach(() => {
    cy.restoreLocalStorageCache();
  });

  afterEach(() => {
    cy.saveLocalStorageCache();
  });

  it('shows loading', () => {
    cy.clearLocalStorageCache();

    cy.visit(rootURL);

    cy.contains('Loading...');
    // cy.wait(5000)
  });

  it('shows intro screen on first load', () => {
    cy.contains('Open drive').click();
  });

  it('eventually shows the drag text', () => {
    cy.wait(5000)
    cy.contains('Drag files to upload or click here');
  });

  it('drive panel opens', () => {
    cy.contains('Drives').click();
    cy.get('.drive').should('have.length', 1);
  });

  it('can nickname a drive', () => {
    cy.get('.drive').first().trigger('mouseenter');
    cy.get('.instanceLabel').first().click();

    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'placeholder', '(ex: Work sketches)');
    input.type('Cool folder name');
    cy.contains('Confirm').click();
    cy.contains('Cool folder name')
  });

  it('can create a private drive', () => {
    cy.contains('Create drive').click();
    cy.contains('Create private drive').click();
    cy.get('.drive').should('have.length', 2);
  });

  it('can nickname a 2nd drive', () => {
    cy.get('.drive').last().trigger('mouseenter');
    cy.get('.instanceLabel').last().click();

    const input = cy.get('input[type="text"]');
    input.should('have.attr', 'placeholder', '(ex: Work sketches)');
    input.type('Test drive 2');
    cy.contains('Confirm').click();
    cy.contains('Test drive 2')
  });

  it('can switch drives', () => {
    cy.contains('Cool folder name').click();
  });

  it('can open drive access panel', () => {
    cy.get('.instanceAccess').first().click();
    cy.contains('permissions for Cool folder name');
  });

  it('Add editor opens contact list add invalid key', () => {
    cy.contains('Add editor').click();
    cy.contains('Add contact').click();
    const inputUser = cy.get('input[type="text"]').first();
    inputUser.should('have.attr', 'placeholder', '(ex: 0356467b31...)');
    inputUser.type('notapublickey');
    cy.get('#addContactDialogButton').click();
    cy.contains('Invalid user ID');
    cy.contains('Cancel').click();
    cy.get('.dialogClose').last().click();
  });

  it('Add editor opens contact list add valid unnamed key', () => {
    cy.contains('Add editor').click();
    cy.contains('Add contact').click();
    const inputUser = cy.get('input[type="text"]').first();
    inputUser.should('have.attr', 'placeholder', '(ex: 0356467b31...)');
    inputUser.type('037f957ecde47e2b0dede1665d2478c32f706e66c7cb5aed19c4783eccdf482dda');

    cy.get('#addContactDialogButton').click();
    cy.contains('037f957e');
    cy.contains('Unnamed').click();
    cy.contains('037f957e');
  });

  it('Add editor opens contact list add valid named key', () => {
    cy.contains('Add editor').click();
    cy.contains('Add contact').click();

    const inputUser = cy.get('input[type="text"]').first();
    inputUser.should('have.attr', 'placeholder', '(ex: 0356467b31...)');
    inputUser.type('0341ff53ed4ed6645e370367172cd36fe5102919cb29512dcbf95d30c64353bd7b');

    const inputLabel = cy.get('input[type="text"]').last();
    inputLabel.should('have.attr', 'placeholder', '(ex: John Richardson)');
    inputLabel.type('Stevie D');

    cy.get('#addContactDialogButton').click();
    cy.contains('0341ff53');
    cy.contains('Stevie D').click();
    cy.contains('0341ff53');
    cy.contains('[Stevie D]');
  });

  it('Add viewer opens contact list add invalid key', () => {
    cy.contains('Add viewer').click();
    cy.contains('Add contact').click();
    const inputUser = cy.get('input[type="text"]').first();
    inputUser.should('have.attr', 'placeholder', '(ex: 0356467b31...)');
    inputUser.type('notapublickey');
    cy.get('#addContactDialogButton').click();
    cy.contains('Invalid user ID');
    cy.contains('Cancel').click();
    cy.get('.dialogClose').last().click();
  });

  it('Add viewer opens contact list add valid named key', () => {
    cy.contains('Add viewer').click();
    cy.contains('Add contact').click();

    const inputUser = cy.get('input[type="text"]').first();
    inputUser.should('have.attr', 'placeholder', '(ex: 0356467b31...)');
    inputUser.type('033d9c2f2d75ef1e2aff3e720d0304a7ef949c783fb0640d10920cfe3864d79ad8');

    const inputLabel = cy.get('input[type="text"]').last();
    inputLabel.should('have.attr', 'placeholder', '(ex: John Richardson)');
    inputLabel.type('Anders Tabcat');

    cy.get('#addContactDialogButton').click();
    cy.contains('033d9c');
    cy.contains('Anders Tabcat').click();
    cy.contains('033d9c');
    cy.contains('[Anders Tabcat]');
  });
});
