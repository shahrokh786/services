describe('Complete User Journey', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should complete user registration and service booking flow', () => {
    // 1. Register as a new user
    cy.get('a[href="/register"]').click();
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="phone"]').type('+1234567890');
    cy.get('button[type="submit"]').click();

    // 2. Navigate to services
    cy.url().should('include', '/services');
    
    // 3. Search for a service
    cy.get('input[placeholder*="Search services"]').type('plumbing');
    cy.get('button').contains('Apply Filters').click();

    // 4. View service details
    cy.get('.service-card').first().click();
    cy.url().should('include', '/services/');

    // 5. Book the service
    cy.get('button').contains('Book Now').click();
    
    // Fill booking form
    cy.get('input[type="date"]').type('2024-02-15');
    cy.get('select').select('morning');
    cy.get('textarea').first().type('Test address 123');
    cy.get('button').contains('Confirm Booking').click();

    // 6. Verify booking confirmation
    cy.contains('Booking request sent successfully').should('be.visible');
  });

  it('should test service provider flow', () => {
    // Login as provider
    cy.get('a[href="/login"]').click();
    cy.get('input[name="email"]').type('provider@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    // Navigate to dashboard
    cy.get('a[href="/dashboard"]').click();
    
    // Create new service
    cy.contains('Add New Service').click();
    cy.get('input[name="title"]').type('New Test Service');
    cy.get('textarea[name="description"]').type('Service description');
    cy.get('select[name="category"]').select('plumbing');
    cy.get('input[name="price"]').type('75');
    cy.get('button[type="submit"]').click();

    // Verify service creation
    cy.contains('New Test Service').should('be.visible');
  });
});