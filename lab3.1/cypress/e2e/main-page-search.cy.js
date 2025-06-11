// cypress/e2e/main-page-search.cy.js

describe('Main page and book search functionality', () => {
    beforeEach(() => {
        // Visit the main page before each test
        cy.visit('/')

        // Wait for books to load
        cy.get('.loading').should('not.exist')
    })

    it('Test 1: Should display main page with search section and book list', () => {
        // Check application header
        cy.get('header h1').should('contain.text', "WELCOME TO MOONEY'S")

        // Check presence of search section
        cy.get('.search').should('be.visible')
        cy.get('.search h2').should('contain.text', 'Search')

        // Check main search field
        cy.get('input[name="searchText"]')
            .should('be.visible')
            .should('have.attr', 'placeholder', 'Search for a book title...')

        // Check search button
        cy.get('button[type="submit"]').should('contain.text', 'Search')

        // Check filters section
        cy.get('.filters').should('be.visible')
        cy.get('.filters h3').should('contain.text', 'Filter books:')

        // Check presence of main filters
        cy.get('input[name="priceFrom"]').should('be.visible')
        cy.get('input[name="priceTo"]').should('be.visible')
        cy.get('select[name="cover"]').should('be.visible')
        cy.get('input[name="author"]').should('be.visible')

        // Check book list header
        cy.get('.book-list-header h2').should('contain.text', 'Book List')

        // Check if book list is visible (or no books message)
        cy.get('.books').should('be.visible')

        // Check footer
        cy.get('footer').should('contain.text', '© 2025 Mooney\'s Bookstore')
    })

    it('Test 2: Should allow searching books by title', () => {
        // Check if there are any books to search
        cy.get('.books').within(() => {
            cy.get('.book, .no-books').should('exist')
        })

        // If there are books, perform search test
        cy.get('.book').then(($books) => {
            if ($books.length > 0) {
                // Get title of first book
                cy.get('.book').first().find('h3').invoke('text').then((firstBookTitle) => {
                    // Search for part of the first book's title
                    const searchTerm = firstBookTitle.split(' ')[0] // First word from title

                    cy.get('input[name="searchText"]')
                        .clear()
                        .type(searchTerm)

                    // Click search button
                    cy.get('button[type="submit"]').click()

                    // Check if results contain the searched term
                    cy.get('.book h3').each(($title) => {
                        cy.wrap($title).should('contain.text', searchTerm)
                    })
                })

                // Test searching for non-existent book
                cy.get('input[name="searchText"]')
                    .clear()
                    .type('NonExistentBook123')

                cy.get('button[type="submit"]').click()

                // Check no results message
                cy.get('.no-books').should('contain.text', 'No books found matching your criteria.')
            } else {
                // If no books, check if message is displayed
                cy.get('.no-books').should('contain.text', 'No books found matching your criteria.')
            }
        })
    })

    it('Test 3: Should allow filtering books by various criteria', () => {
        // Test filtering by cover type
        cy.get('select[name="cover"]').select('Hardcover')
        cy.get('button[type="submit"]').click()

        // Check if all displayed books have hardcover
        cy.get('.book').then(($books) => {
            if ($books.length > 0) {
                cy.get('.book').each(($book) => {
                    cy.wrap($book).should('contain.text', 'Hardcover')
                })
            }
        })

        // Reset cover filter
        cy.get('select[name="cover"]').select('All')

        // Test filtering by author
        cy.get('.book').then(($books) => {
            if ($books.length > 0) {
                // Get author of first book
                cy.get('.book').first().find('.book-author').invoke('text').then((authorText) => {
                    const authorName = authorText.replace('By: ', '').split(' ')[0] // First word of author name

                    cy.get('input[name="author"]')
                        .clear()
                        .type(authorName)

                    cy.get('button[type="submit"]').click()

                    // Check if results contain the searched author
                    cy.get('.book .book-author').each(($author) => {
                        cy.wrap($author).should('contain.text', authorName)
                    })
                })
            }
        })

        // Test filtering by price range
        cy.get('input[name="priceFrom"]').clear().type('10')
        cy.get('input[name="priceTo"]').clear().type('50')
        cy.get('button[type="submit"]').click()

        // Check if displayed books are within price range
        cy.get('.book .book-price').then(($prices) => {
            if ($prices.length > 0) {
                cy.get('.book .book-price').each(($price) => {
                    cy.wrap($price).invoke('text').then((priceText) => {
                        const price = parseFloat(priceText.replace('$', ''))
                        expect(price).to.be.at.least(10)
                        expect(price).to.be.at.most(50)
                    })
                })
            }
        })

        // Test filtering by page count
        cy.get('input[name="pagesFrom"]').clear().type('100')
        cy.get('input[name="pagesTo"]').clear().type('500')
        cy.get('button[type="submit"]').click()

        // Check if books are within page range
        cy.get('.book').then(($books) => {
            if ($books.length > 0) {
                cy.get('.book').each(($book) => {
                    cy.wrap($book).contains('Pages:').invoke('text').then((pagesText) => {
                        const pages = parseInt(pagesText.replace('Pages: ', ''))
                        expect(pages).to.be.at.least(100)
                        expect(pages).to.be.at.most(500)
                    })
                })
            }
        })

        // Test filtering by description
        cy.get('input[name="description"]').clear().type('book')
        cy.get('button[type="submit"]').click()

        // Check if descriptions contain the searched word
        cy.get('.book .book-description').then(($descriptions) => {
            if ($descriptions.length > 0) {
                cy.get('.book .book-description').each(($description) => {
                    cy.wrap($description).invoke('text').should('match', /book/i)
                })
            }
        })
    })
})