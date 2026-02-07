describe('dashboards index', function() {
  beforeEach(() => {
    cy.app('clean');
  });

  it("loads the dashboard", function() {
    cy.appFactories([
      ['create', 'audio_feed']
    ]).then((records) => {
      cy.visit("/");

      cy.get('[data-test-id="audio-feed-list"]').should('be.visible');
      cy.get('[data-test-id="map-view"]').should('be.hidden');
      cy.get('[data-test-id="preset-view"]').should('be.hidden');

      cy.get('[data-test-id="map-view-button"]').click();
      cy.get('[data-test-id="audio-feed-list"]').should('be.hidden');
      cy.get('[data-test-id="map-view"]').should('be.visible');
      cy.get('[data-test-id="preset-view"]').should('be.hidden');

      cy.get('[data-test-id="preset-view-button"]').click();
      cy.get('[data-test-id="audio-feed-list"]').should('be.hidden');
      cy.get('[data-test-id="map-view"]').should('be.hidden');
      cy.get('[data-test-id="preset-view"]').should('be.visible');

      cy.get('[data-test-id="list-view-button"]').click();
      cy.get('[data-test-id="audio-feed-list"]').should('be.visible');
      cy.get('[data-test-id="map-view"]').should('be.hidden');
      cy.get('[data-test-id="preset-view"]').should('be.hidden');

      cy.get('[data-test-id="audio-feed-list"]').should('contain', records[0].name);
      cy.get('[data-test-id="audio-feed-list"]').should('contain', records[0].city);
      cy.get('[data-test-id="audio-feed-list"]').should('contain', records[0].state);

      cy.get('.selected-feed-item:first').should('be.hidden'); // template
      cy.get('.selected-feed-item').should('have.length', 1);
      cy.get('[data-test-id="audio-feed-list"] .audio-feed-item:first').click();

      cy.get('.selected-feed-item').should('have.length', 2);
      cy.get('.selected-feed-item:last').should('contain', records[0].name);
      cy.get('.selected-feed-item:last').should('contain', records[0].city);
      cy.get('.selected-feed-item:last').should('contain', records[0].state);

      cy.get('.selected-feed-item:last .selected-feed-remove').click();

      cy.get('.selected-feed-item:first').should('be.hidden'); // template
      cy.get('.selected-feed-item').should('have.length', 1);
    });
  });

  it("searches audio feeds", function() {
    cy.appFactories([
      ['create', 'audio_feed'],
      ['create', 'audio_feed'],
      ['create', 'audio_feed'],
      ['create', 'audio_feed'],
      ['create', 'audio_feed'],
      ['create', 'audio_feed'],
      ['create', 'audio_feed'],
      ['create', 'audio_feed'],
      ['create', 'audio_feed']
    ]).then((records) => {
      cy.visit("/");
      cy.get('.audio-feed-item').should('have.length', 9);
      cy.get('.audio-feed-item.hidden').should('have.length', 0);
      cy.get('[data-test-id="audio-feed-search"]').clear().type(records[2].name);
      cy.get('.audio-feed-item.hidden').should('have.length', 8); // all other records are hidden
    });
  });

  it("adds and deletes preset", function() {
    cy.appFactories([
      ['create', 'audio_feed'],
      ['create', 'audio_feed'],
      ['create', 'audio_feed']
    ]).then(() => {
      cy.visit("/");
      cy.get('[data-test-id="audio-feed-list"] .audio-feed-item').eq(0).click();
      cy.get('[data-test-id="audio-feed-list"] .audio-feed-item').eq(1).click();
      cy.get('[data-test-id="audio-feed-list"] .audio-feed-item').eq(2).click();

      cy.get('[data-test-id="preset-view-button"]').click();
      cy.get('.preset-item:first').should('be.hidden'); // template
      cy.get('.preset-item').should('have.length', 1);

      cy.window().then((win) => {
        cy.stub(win, 'prompt').returns('Sample Preset');
      });
      cy.get('[data-test-id="save-preset-button"]').click();
      cy.get('.preset-item').should('have.length', 2);
      cy.get('.preset-item:last').should('contain', 'Sample Preset');

      cy.get('.preset-item:last .preset-delete').click({ force: true });
      cy.get('.preset-item:first').should('be.hidden'); // template
      cy.get('.preset-item').should('have.length', 1);
    });
  });

  it("applies and deletes a preset", function() {
    cy.appFactories([
      ['create', 'audio_feed'],
      ['create', 'audio_feed'],
      ['create', 'audio_feed']
    ]).then((records) => {
      const audioFeedIds = records.map((audioFeed) => audioFeed.id);
      cy.appFactories([
        ['create', 'preset', { name: 'Sample Preset', audio_feed_ids: audioFeedIds }],
      ]).then(() => {
        cy.visit("/");
        cy.get('[data-test-id="preset-view-button"]').click();
        cy.get('.preset-item').should('have.length', 2);
        cy.get('.preset-item:last').should('contain', 'Sample Preset');
        cy.get('.preset-item:last').should('contain', '3 feeds');
        cy.get('.preset-item:last .preset-name').click();

        records.forEach((record) => {
          cy.get('[data-test-id="audio-feed-list"]').should('contain', record.name);
          cy.get('[data-test-id="audio-feed-list"]').should('contain', record.city);
          cy.get('[data-test-id="audio-feed-list"]').should('contain', record.state);
        });

        cy.get('.preset-item:last .preset-delete').click({ force: true });
        cy.get('.preset-item:first').should('be.hidden'); // template
        cy.get('.preset-item').should('have.length', 1);
      });
    });
  });
});
