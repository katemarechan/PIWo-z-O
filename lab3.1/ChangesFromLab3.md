Added to the program/changes in the scripts:
- BookContext.jsx - Updated to use Firestore instead of local state
- root.jsx - Added Google authentication
- main.jsx - Added "MY BOOKS" filter and ownership display
- edit.jsx - Updated to enforce ownership and use the form hook
- new.jsx - Updated to associate books with owners and use the form hook
- useBookForm.js - New file with custom hook for form handling
- index.css - Updated with new styling and color palette

1. BookContext.jsx

- Replaced local state with Firestore integration
- Added fetchBooks() to retrieve books from database
- Modified addBook() to create Firestore documents
- Updated updateBook() to modify Firestore documents
- Revised deleteBook() to remove Firestore documents
- Added getMyBooks() to filter by owner
- Added isBookOwner() to check book ownership
- Added timestamp metadata to book operations

2. root.jsx

- Integrated Firebase authentication
- Added Google sign-in functionality
- Updated AuthContext to provide user data
- Modified UI to show current user
- Added sign-out function

3. main.jsx

- Added "MY BOOKS" toggle button
- Implemented book filtering by owner
- Updated book deletion to respect ownership
- Added owner badge to book display
- Modified filter logic to work with Firestore data
- Added loading state while fetching books

4. edit.jsx

- Added ownership verification before editing
- Implemented form state management with custom hook
- Loading states during book loading/saving
- Better error handling
- Preserved ownership data during updates
- UI feedback during submission

5. new.jsx

- Added owner data to new books
- Integrated custom form hook
- Improved form validation
- Added loading state during submission
- Enhanced error handling
- Optimized form rendering
- Added clear form functionality

6. useBookForm.js

Added new hook for rendering purposes during the edit into the newly created folder "Hooks"

- Implemented change handlers
- Added form reset functionality
- Centralized error and submission state
- Optimized to prevent re-renders during typing

7. index.css

Changed the color pallet of the page with the help of Color Pallete Generator "Coolors" with the colors Raisin Black, Delft Blue, UCLA Blue, Powder Blue and Mint Green.
Changed the color of the error message to Burgungy. Simply aesthetic changes from the designer point, nothing more, plus it made the project a bit more defined and added its own charm to it + consistency. 
Plus changed the fonts so the pages look more stylized.

Overall the changes and new additions are:

- Updated color scheme to use new palette
- Improved button and input styling
- Added owner badge styling
- Enhanced form styling and feedback
- Added loading and error message styling
- Optimized layout for better readability
