// --- Nutrition Fact Finder Logic ---
document.addEventListener('DOMContentLoaded', function () {
    const mealSelect = document.getElementById('nutritionMealSelect');
    const factsResult = document.getElementById('nutritionFactsResult');
    if (mealSelect && factsResult) {
        // Populate dropdown
        meals.forEach(meal => {
            const opt = document.createElement('option');
            opt.value = meal.id;
            opt.textContent = meal.name;
            mealSelect.appendChild(opt);
        });
        mealSelect.addEventListener('change', function () {
            const meal = meals.find(m => m.id == this.value);
            if (meal) {
                factsResult.innerHTML = `
                    <h4>${meal.name}</h4>
                    <ul class="nutrition-facts-list">
                        <li><strong>Calories:</strong> ${meal.calories || 'N/A'}</li>
                        <li><strong>Protein:</strong> ${meal.protein || 'N/A'}</li>
                        <li><strong>Carbs:</strong> ${meal.carbs || 'N/A'}</li>
                        <li><strong>Fat:</strong> ${meal.fat || 'N/A'}</li>
                        <li><strong>Fiber:</strong> ${meal.fiber || 'N/A'}</li>
                    </ul>
                `;
                factsResult.style.display = '';
            } else {
                factsResult.style.display = 'none';
                factsResult.innerHTML = '';
            }
        });
    }
});
// --- Users Section Logic ---
document.addEventListener('DOMContentLoaded', function () {
    const usersNavLink = document.getElementById('usersNavLink');
    const usersSection = document.getElementById('users');
    const usersList = document.getElementById('usersList');
    // Show Users nav link if authenticated
    if (localStorage.getItem('dwm-authenticated') && usersNavLink) {
        usersNavLink.style.display = '';
    }
    // Show Users section on nav click
    if (usersNavLink) {
        usersNavLink.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.section, #home').forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
            });
            if (usersSection) {
                usersSection.style.display = 'block';
                usersSection.classList.add('active');
                renderUsersList();
            }
        });
    }
    // Save user on signup
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            // Only save if not already handled by completeAuth
            const user = {
                name: document.getElementById('signupName').value,
                email: document.getElementById('signupEmail').value,
                address: document.getElementById('signupAddress').value,
                phone: document.getElementById('signupPhone').value,
                healthGoal: document.getElementById('signupHealthGoal').value,
                currentWeight: document.getElementById('signupCurrentWeight').value,
                targetWeight: document.getElementById('signupTargetWeight').value,
                allergies: document.getElementById('signupAllergies').value,
                lifestyle: document.getElementById('signupLifestyle').value,
                preference: document.getElementById('signupPreference').value,
                other: document.getElementById('signupOther').value
            };
            let users = [];
            try {
                users = JSON.parse(localStorage.getItem('dwm-users') || '[]');
            } catch { }
            users.push(user);
            localStorage.setItem('dwm-users', JSON.stringify(users));
        });
    }
    // Render users list
    function renderUsersList() {
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem('dwm-users') || '[]');
        } catch { }
        if (!usersList) return;
        if (users.length === 0) {
            usersList.innerHTML = '<p>No users registered yet.</p>';
            return;
        }
        usersList.innerHTML = '<div class="users-table-wrapper"><table class="users-table"><thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Phone</th><th>Goal</th><th>Current Weight</th><th>Target Weight</th><th>Allergies</th><th>Lifestyle</th><th>Preference</th><th>Other</th></tr></thead><tbody>' +
            users.map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.address}</td><td>${u.phone}</td><td>${u.healthGoal}</td><td>${u.currentWeight}</td><td>${u.targetWeight}</td><td>${u.allergies}</td><td>${u.lifestyle}</td><td>${u.preference}</td><td>${u.other}</td></tr>`).join('') +
            '</tbody></table></div>';
    }
    // Show Users nav link after login/signup
    if (usersNavLink) {
        document.addEventListener('dwm-auth-success', function () {
            usersNavLink.style.display = '';
        });
    }
});
// --- Force Login Modal on First Visit ---
document.addEventListener('DOMContentLoaded', function () {
    const authOverlay = document.getElementById('authOverlay');
    const loginSignupBtn = document.getElementById('loginSignupBtn');
    // Check if user is 'authenticated' (for demo, use localStorage)
    if (authOverlay && !localStorage.getItem('dwm-authenticated')) {
        authOverlay.classList.add('active');
        if (loginSignupBtn) loginSignupBtn.style.display = 'none';
        // Hide main app content from screen readers/tab
        document.body.classList.add('auth-blocked');
    }
    // Hide login/signup button when modal is open
    if (authOverlay) {
        const observer = new MutationObserver(() => {
            if (authOverlay.classList.contains('active')) {
                if (loginSignupBtn) loginSignupBtn.style.display = 'none';
                document.body.classList.add('auth-blocked');
            } else {
                if (loginSignupBtn) loginSignupBtn.style.display = '';
                document.body.classList.remove('auth-blocked');
            }
        });
        observer.observe(authOverlay, { attributes: true, attributeFilter: ['class'] });
    }
    // On successful login/signup, close modal and set flag
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    function completeAuth(e) {
        e.preventDefault();
        if (authOverlay) authOverlay.classList.remove('active');
        localStorage.setItem('dwm-authenticated', '1');
        if (loginSignupBtn) loginSignupBtn.style.display = '';
        document.body.classList.remove('auth-blocked');
    }
    if (loginForm) loginForm.addEventListener('submit', completeAuth);
    if (signupForm) signupForm.addEventListener('submit', completeAuth);
});
// --- Authentication Modal Logic ---
document.addEventListener('DOMContentLoaded', function () {
    const authOverlay = document.getElementById('authOverlay');
    const authContainer = document.getElementById('authContainer');
    const loginSignupBtn = document.getElementById('loginSignupBtn');
    const authCloseBtn = document.getElementById('authCloseBtn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');

    if (loginSignupBtn) {
        loginSignupBtn.addEventListener('click', function () {
            authOverlay.classList.add('active');
            loginForm.style.display = '';
            signupForm.style.display = 'none';
            authTitle.textContent = 'Login';
            authSubtitle.textContent = 'Welcome back! Please login to your account.';
        });
    }
    if (authCloseBtn) {
        authCloseBtn.addEventListener('click', function () {
            authOverlay.classList.remove('active');
        });
    }
    if (showSignup) {
        showSignup.addEventListener('click', function (e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            signupForm.style.display = '';
            authTitle.textContent = 'Sign Up';
            authSubtitle.textContent = 'Create your account to get started!';
        });
    }
    if (showLogin) {
        showLogin.addEventListener('click', function (e) {
            e.preventDefault();
            loginForm.style.display = '';
            signupForm.style.display = 'none';
            authTitle.textContent = 'Login';
            authSubtitle.textContent = 'Welcome back! Please login to your account.';
        });
    }
    // Close modal on overlay click (not on modal content)
    if (authOverlay) {
        authOverlay.addEventListener('click', function (e) {
            if (e.target === authOverlay) {
                authOverlay.classList.remove('active');
            }
        });
    }
    // ESC key closes modal
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && authOverlay && authOverlay.classList.contains('active')) {
            authOverlay.classList.remove('active');
        }
    });
});
// ...removed erroneous <script> tag...
// App State
let cart = [];
let currentSection = 'home';

// Sample Data
const meals = [
    {
        id: 101,
        name: "Moi Moi",
        category: "rice",
        price: 2500,
        image: "https://www.mydiasporakitchen.com/wp-content/uploads/2019/06/savingpng-19.png",
        description: "Steamed bean pudding made from blended beans, peppers, and spices. Soft, savory, and protein-rich, often served as a side or main dish.",
        prepTime: 15, cookTime: 40, calories: 210, protein: '12g', carbs: '28g', fat: '7g', fiber: '3g',
        availability: 'Available'
    },
    // --- Added missing menu items from reference list ---
    {
        id: 61, name: 'Egusi Soup', price: 7500, category: 'soup', image: 'https://bestfriendpitchrestaurant.com/wp-content/uploads/2024/10/Best-Friend-Restaurant-Egusi-Soup-In-Lagos-Mainland.jpg',
        description: 'Thick soup made with melon seeds, leafy greens, and assorted meats.',
        prepTime: 18, cookTime: 25, calories: 420, protein: '18g', carbs: '10g', fat: '34g', fiber: '4g',
        availability: 'Available'
    },
    {
        id: 62, name: 'Bitterleaf Soup (Ofe Onugbu)', price: 7500, category: 'soup', image: 'https://wigmoretrading.com/wp-content/uploads/2024/08/Bitterleaf-Soup.jpg',
        description: 'Soup made from bitterleaf, often with thick stock.',
        prepTime: 18, cookTime: 25, calories: 410, protein: '15g', carbs: '11g', fat: '32g', fiber: '5g',
        availability: 'Available'
    },



    {
        id: 66, name: 'Chin Chin', price: 3000, category: 'snacks', image: 'https://cdn.shopify.com/s/files/1/0521/2415/6104/articles/Chin_Chin.jpg?v=1639595235',
        description: 'Crunchy fried dough bits.',
        prepTime: 12, cookTime: 8, calories: 220, protein: '3g', carbs: '35g', fat: '7g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 67, name: 'Nkwobi', price: 15000, category: 'proteins', image: 'https://www.chefspencil.com/wp-content/uploads/Nkwobi.jpg',
        description: 'Cow foot in spicy palm oil sauce.',
        prepTime: 20, cookTime: 30, calories: 420, protein: '18g', carbs: '8g', fat: '36g', fiber: '2g',
        availability: 'Available'
    },

    {
        id: 4, name: 'Pepper Soup', price: 7500, category: 'soup', image: 'https://cdn.guardian.ng/wp-content/uploads/2022/04/Yam-pepper-soup-Photo-Sisi-Jemimah.jpeg',
        description: 'Spicy Nigerian pepper soup with fish.',
        prepTime: 10, cookTime: 20, calories: 300, protein: '22g', carbs: '6g', fat: '8g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 2, name: 'Fried Rice', price: 7500, category: 'rice', image: 'https://recipe30.com/wp-content/uploads/2020/05/chicken-fried-rice.jpg',
        description: 'Nigerian-style fried rice with mixed vegetables.',
        prepTime: 12, cookTime: 10, calories: 350, protein: '7g', carbs: '58g', fat: '10g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 5, name: 'Suya', price: 6000, category: 'proteins', image: 'https://www.africanbites.com/wp-content/uploads/2022/03/a-plate-of-stacked-suya-beef-copy.jpg',
        description: 'Grilled beef skewers marinated in a blend of Nigerian spices and herbs.',
        prepTime: 15, cookTime: 10, calories: 380, protein: '32g', carbs: '8g', fat: '24g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 6, name: 'Grilled Chicken', price: 2500, category: 'proteins', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCejJG8uGK5kCRUQUlRptPivNJj8kSoWtjgg&s',
        description: 'Nigerian-style grilled chicken with spices.',
        prepTime: 20, cookTime: 25, calories: 410, protein: '35g', carbs: '5g', fat: '18g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 7, name: 'Puff Puff', price: 1500, category: 'snacks', image: 'https://simshomekitchen.com/wp-content/uploads/2023/01/puffpuff-nigerian.jpg',
        description: 'Sweet Nigerian doughnuts.',
        prepTime: 10, cookTime: 10, calories: 250, protein: '4g', carbs: '40g', fat: '8g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 9, name: 'Ofada Rice', price: 8000, category: 'rice', image: 'https://humblesagefood.com/wp-content/uploads/Ofada-and-Ayamase-sauce.jpg',
        description: 'Local Nigerian rice with special sauce.',
        prepTime: 15, cookTime: 12, calories: 370, protein: '7g', carbs: '62g', fat: '11g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 11, name: 'Grilled Fish', price: 8000, category: 'proteins', image: 'https://heritagenaijakitchen.com/wp-content/uploads/2023/12/images-4.jpg',
        description: 'Fresh grilled tilapia with Nigerian spices.',
        prepTime: 15, cookTime: 20, calories: 360, protein: '30g', carbs: '4g', fat: '14g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 12, name: 'Meat Pie', price: 2000, category: 'snacks', image: 'https://kikifoodies.com/wp-content/uploads/2024/12/3A8364CE-2F40-4ABD-BD01-72AF8BF5CDEC.jpeg',
        description: 'Nigerian-style savory meat pies.',
        prepTime: 12, cookTime: 15, calories: 320, protein: '8g', carbs: '38g', fat: '12g', fiber: '2g',
        availability: 'Available'
    },
    ,
    // New Meals
    {
        id: 13, name: 'Jollof Pasta', price: 7000, category: 'pasta', image: 'https://www.mydiasporakitchen.com/wp-content/uploads/2018/04/img_0719.jpg',
        description: 'Spicy Nigerian jollof pasta with vegetables and chicken.',
        prepTime: 15, cookTime: 15, calories: 400, protein: '10g', carbs: '65g', fat: '13g', fiber: '3g',
        availability: 'Available'
    },
    {
        id: 14, name: 'Stirfry Pasta', price: 8000, category: 'pasta', image: 'https://i.ytimg.com/vi/bH5G0_Nweac/maxresdefault.jpg',
        description: 'Nigerian-style stirfry pasta with colorful veggies.',
        prepTime: 12, cookTime: 12, calories: 410, protein: '9g', carbs: '68g', fat: '11g', fiber: '4g',
        availability: 'Available'
    },
    {
        id: 15, name: 'Chicken Curry Pasta', price: 9000, category: 'pasta', image: 'https://www.kitchengonerogue.com/wp-content/uploads/2025/04/chicken-curry-pasta-new-horiz-fav-IMG_6172.jpg',
        description: 'Creamy pasta with chicken curry sauce.',
        prepTime: 15, cookTime: 15, calories: 430, protein: '14g', carbs: '66g', fat: '15g', fiber: '3g',
        availability: 'Available'
    },
    {
        id: 16, name: 'Coconut Rice', price: 9000, category: 'rice', image: 'https://www.chefspencil.com/wp-content/uploads/Nigerian-Coconut-Rice.jpg',
        description: 'Fragrant rice cooked in coconut milk with spices.',
        prepTime: 15, cookTime: 15, calories: 390, protein: '6g', carbs: '64g', fat: '14g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 17, name: 'Ogbono Soup', price: 7500, category: 'soup', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5jbWbeLgz5xF1Owu5wih2lRmFDMaRouHHIg&s',
        description: 'Draw soup made with ogbono seeds and assorted meats.',
        prepTime: 18, cookTime: 25, calories: 420, protein: '17g', carbs: '8g', fat: '36g', fiber: '4g',
        availability: 'Available'
    },
    {
        id: 18, name: 'Okro Soup', price: 7500, category: 'soup', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzpxKLphFHjT5PQYOLG2kjLSvltLijuWB43A&s',
        description: 'Classic okro soup with assorted meats and fish.',
        prepTime: 15, cookTime: 20, calories: 380, protein: '15g', carbs: '10g', fat: '30g', fiber: '5g',
        availability: 'Available'
    },
    {
        id: 19, name: 'Vegetable Soup', price: 8500, category: 'soup', image: 'https://www.yummymedley.com/wp-content/uploads/2015/01/Nigerian-Spinach-Stew-Ready-and-Served-500x500.jpg',
        description: 'Rich soup made with green leafy vegetables and assorted proteins.',
        prepTime: 15, cookTime: 20, calories: 400, protein: '16g', carbs: '12g', fat: '28g', fiber: '6g',
        availability: 'Available'
    },
    {
        id: 20, name: 'Banga Soup', price: 12000, category: 'soup', image: 'https://www.chefspencil.com/wp-content/uploads/Banga-Soup.jpg',
        description: 'Palm nut soup with assorted meats and spices.',
        prepTime: 20, cookTime: 30, calories: 450, protein: '18g', carbs: '14g', fat: '38g', fiber: '5g',
        availability: 'Available'
    },
    {
        id: 21, name: 'Roasted Plantain (Bole) & Fish', price: 10000, category: 'snacks', image: 'https://i.pinimg.com/736x/8c/a2/10/8ca21085b5d0e0cbb173491efd87e5af.jpg',
        description: 'Charred plantain served with spicy grilled fish.',
        prepTime: 10, cookTime: 20, calories: 370, protein: '12g', carbs: '60g', fat: '10g', fiber: '4g',
        availability: 'Available'
    },
    {
        id: 22, name: 'Fufu', price: 1000, category: 'sides', image: 'https://www.chefspencil.com/wp-content/uploads/Fufu.jpg',
        description: 'Classic Nigerian fufu, perfect with any soup.',
        prepTime: 10, cookTime: 10, calories: 180, protein: '2g', carbs: '40g', fat: '0g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 23, name: 'Eba', price: 2000, category: 'sides', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRql0nFBguMy-KJe1IzRBU9Wyt6U-HgYBz8HQ&s',
        description: 'Cassava-based swallow, a staple side for soups.',
        prepTime: 8, cookTime: 5, calories: 200, protein: '1g', carbs: '45g', fat: '0g', fiber: '1g',
        availability: 'Available'
    },


    {
        id: 26, name: 'Potato Pottage', price: 6000, category: 'rice', image: 'https://nkechiajaeroh.com/wp-content/uploads/2018/12/Sweet-Potato-Porridge-recipe-photo-1.jpg',
        description: 'Yam or potato pottage cooked in palm oil with vegetables.',
        prepTime: 15, cookTime: 25, calories: 370, protein: '6g', carbs: '60g', fat: '10g', fiber: '3g',
        availability: 'Available'
    }
    ,
    // More Meals
    {
        id: 27, name: 'White Rice', price: 3000, category: 'rice', image: 'https://www.endofthefork.com/wp-content/uploads/2017/03/1200x1200-boiled-fluffy-rice.jpg',
        description: 'Steamed white rice, perfect with any stew or sauce.',
        prepTime: 10, cookTime: 15, calories: 340, protein: '6g', carbs: '72g', fat: '0g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 28, name: 'Beef Stew', price: 9000, category: 'proteins', image: 'https://www.myactivekitchen.com/wp-content/uploads/2019/05/nigerian-beef-stew_image_9.jpg',
        description: 'Rich tomato-based stew with tender beef.',
        prepTime: 15, cookTime: 20, calories: 380, protein: '18g', carbs: '10g', fat: '28g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 29, name: 'Chicken Stew', price: 9500, category: 'proteins', image: 'https://www.mydiasporakitchen.com/wp-content/uploads/2025/05/Nigerian-chicken-stew-recipe-0.jpeg',
        description: 'Spicy tomato stew with chicken pieces.',
        prepTime: 15, cookTime: 20, calories: 370, protein: '20g', carbs: '9g', fat: '25g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 30, name: 'Gizdodo', price: 8000, category: 'snacks', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJs0HIVJd-RW7gcazKxJhmhUO1tgsstJKtKA&s',
        description: 'A delicious mix of gizzard and plantain in spicy sauce.',
        prepTime: 12, cookTime: 15, calories: 410, protein: '12g', carbs: '45g', fat: '18g', fiber: '3g',
        availability: 'Available'
    },
    {
        id: 31, name: 'Pancakes', price: 3500, category: 'snacks', image: 'https://www.bhg.com/thmb/B1Mbx1q9AgIEJ8PbQpPq0QPs820=/4000x0/filters:no_upscale():strip_icc()/bhg-recipe-pancakes-waffles-pancakes-Hero-01-372c4cad318d4373b6288e993a60ca62.jpg',
        description: 'Nigerian-style sweet and savory pancakes.',
        prepTime: 10, cookTime: 10, calories: 220, protein: '5g', carbs: '32g', fat: '8g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 32, name: 'White Soup (Ofe Nsala)', price: 13000, category: 'soup', image: 'https://shopafricausa.com/cdn/shop/articles/ofe_nsala_i_1048x.jpg?v=1614961053',
        description: 'Traditional Igbo white soup with catfish and yam.',
        prepTime: 18, cookTime: 25, calories: 420, protein: '16g', carbs: '14g', fat: '32g', fiber: '3g',
        availability: 'Available'
    },
    {
        id: 33, name: 'Okpa', price: 4000, category: 'snacks', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSydKmC4dV-kYEqzZi88E4jSHXMsgs8vx9jDA&s',
        description: 'Steamed Bambara nut pudding, a delicacy from Eastern Nigeria.',
        prepTime: 15, cookTime: 40, calories: 320, protein: '10g', carbs: '38g', fat: '8g', fiber: '3g',
        availability: 'Available'
    },
    {
        id: 34, name: 'Abacha', price: 6000, category: 'snacks', image: 'https://feastandbeyond.co.uk/wp-content/uploads/2023/10/abacha.jpg',
        description: 'African salad made from cassava, served with fish and vegetables.',
        prepTime: 15, cookTime: 10, calories: 350, protein: '6g', carbs: '60g', fat: '10g', fiber: '4g',
        availability: 'Available'
    },
    {
        id: 35, name: 'Nkwobi', price: 12000, category: 'snacks', image: 'https://www.chefspencil.com/wp-content/uploads/Nkwobi.jpg',
        description: 'Cow foot dish in spicy palm oil sauce, a popular Igbo delicacy.',
        prepTime: 20, cookTime: 30, calories: 420, protein: '18g', carbs: '8g', fat: '36g', fiber: '2g',
        availability: 'Available'
    },
    // --- Added missing menu items from reference list ---
    {
        id: 36, name: 'Afang Soup', price: 7500, category: 'soup', image: 'https://deychop.com/wp-content/uploads/2023/12/Afang-Soup.jpeg',
        description: 'Leafy soup made with waterleaf and afang leaves (okazi).',
        prepTime: 18, cookTime: 25, calories: 410, protein: '15g', carbs: '10g', fat: '32g', fiber: '4g',
        availability: 'Available'
    },
    {
        id: 37, name: 'Edikang Ikong', price: 7500, category: 'soup', image: 'https://www.nairaland.com/attachments/2744747_edikaikongsoup_jpeg71f021afc79c28c460107913b70b63ca',
        description: 'Rich vegetable soup made with pumpkin leaves and waterleaf.',
        prepTime: 18, cookTime: 25, calories: 420, protein: '16g', carbs: '12g', fat: '34g', fiber: '5g',
        availability: 'Available'
    },

    {
        id: 39, name: 'Oha Soup', price: 7500, category: 'soup', image: 'https://royalafricancafe.com/wp-content/uploads/2024/08/oha_soup.jpg',
        description: 'Traditional Igbo soup made with oha leaves.',
        prepTime: 18, cookTime: 25, calories: 410, protein: '14g', carbs: '11g', fat: '30g', fiber: '4g',
        availability: 'Available'
    },
    {
        id: 40, name: 'Pounded Yam', price: 4000, category: 'sides', image: 'https://afrifoodnetwork.com/wp-content/uploads/2017/04/wrapped-pounded-yam.jpg',
        description: 'Smooth, stretchy yam swallow, perfect with any soup.',
        prepTime: 10, cookTime: 10, calories: 200, protein: '2g', carbs: '45g', fat: '0g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 41, name: 'Amala', price: 4500, category: 'sides', image: 'https://image.api.sportal365.com/process/smp-images-production/pulse.ng/25072024/00ed772c-1ddf-4c43-8a5a-1516461f4c1e',
        description: 'Yam flour swallow, dark and smooth, popular in Western Nigeria.',
        prepTime: 10, cookTime: 10, calories: 190, protein: '2g', carbs: '44g', fat: '0g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 42, name: 'Semovita', price: 3500, category: 'sides', image: 'https://mandifoods.com.ng/wp-content/uploads/2022/11/Semo.jpg',
        description: 'Wheat-based swallow, light and smooth.',
        prepTime: 10, cookTime: 10, calories: 180, protein: '2g', carbs: '42g', fat: '0g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 43, name: 'Tuwo Shinkafa', price: 3500, category: 'sides', image: 'https://www.chefspencil.com/wp-content/uploads/Tuwo-Shinkafa.jpg',
        description: 'Northern Nigerian rice flour swallow.',
        prepTime: 10, cookTime: 10, calories: 190, protein: '2g', carbs: '44g', fat: '0g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 44, name: 'Wheat Swallow', price: 2000, category: 'sides', image: 'https://i0.wp.com/skippersfastfood.com/wp-content/uploads/2024/09/amala-2.jpg?resize=500%2C500&ssl=1',
        description: 'Swallow made from wheat flour.',
        prepTime: 10, cookTime: 10, calories: 180, protein: '2g', carbs: '42g', fat: '0g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 45, name: 'Kilishi', price: 7000, category: 'proteins', image: 'https://www.chefspencil.com/wp-content/uploads/Kilishi.jpg',
        description: 'Dried, spiced meat similar to jerky.',
        prepTime: 10, cookTime: 20, calories: 350, protein: '30g', carbs: '6g', fat: '18g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 46, name: 'Asun', price: 10000, category: 'proteins', image: 'https://assets.ekotoken.ng/wp-content/uploads/sites/5/2022/11/04094423/asun-600x600-1.jpg',
        description: 'Spicy grilled goat meat.',
        prepTime: 15, cookTime: 20, calories: 370, protein: '28g', carbs: '4g', fat: '22g', fiber: '1g',
        availability: 'Available'
    },

    {
        id: 48, name: 'Buns', price: 2500, category: 'snacks', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsaVhejZ6-rgYCU3tvTiDyxaioYjTeI3Il4A&s',
        description: 'Fried dough, denser than puff puff.',
        prepTime: 10, cookTime: 10, calories: 260, protein: '4g', carbs: '42g', fat: '10g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 49, name: 'Akara', price: 2000, category: 'snacks', image: 'https://proveg.org/ng/wp-content/uploads/sites/4/2024/04/Akara-scaled-1.jpg',
        description: 'Bean cakes (deep-fried ground beans).',
        prepTime: 10, cookTime: 10, calories: 220, protein: '6g', carbs: '28g', fat: '8g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 50, name: 'Fish Roll', price: 1000, category: 'snacks', image: 'https://dolapogrey.com/wp-content/uploads/2020/10/IMG_20191009_162639_356-1-1024x1024.jpg',
        description: 'Deep-fried pastry stuffed with spicy fish filling.',
        prepTime: 12, cookTime: 15, calories: 320, protein: '7g', carbs: '36g', fat: '12g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 51, name: 'Sausage Roll', price: 2000, category: 'snacks', image: 'https://www.amummytoo.co.uk/wp-content/uploads/2024/07/air-fryer-vegetarian-sausage-rolls-SQUARE.jpg',
        description: 'Baked pastry with sausage filling.',
        prepTime: 12, cookTime: 15, calories: 320, protein: '7g', carbs: '36g', fat: '12g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 52, name: 'Plantain Chips', price: 2000, category: 'snacks', image: 'https://www.chefspencil.com/wp-content/uploads/Plantain-Chips.jpg',
        description: 'Thinly sliced and fried ripe/unripe plantains.',
        prepTime: 8, cookTime: 8, calories: 180, protein: '1g', carbs: '30g', fat: '6g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 53, name: 'Coconut Candy', price: 2000, category: 'snacks', image: 'https://www.chefspencil.com/wp-content/uploads/Coconut-Candy.jpg',
        description: 'Grated coconut cooked with sugar until caramelized.',
        prepTime: 10, cookTime: 15, calories: 210, protein: '2g', carbs: '28g', fat: '8g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 54, name: 'Donkwa (Tanfiri)', price: 2000, category: 'snacks', image: 'https://www.chefspencil.com/wp-content/uploads/Donkwa.jpg',
        description: 'Peanut and cornmeal snack.',
        prepTime: 8, cookTime: 5, calories: 190, protein: '3g', carbs: '24g', fat: '7g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 55, name: 'Kuli Kuli', price: 2000, category: 'snacks', image: 'https://www.chefspencil.com/wp-content/uploads/Kuli-Kuli.jpg',
        description: 'Crunchy peanut snack.',
        prepTime: 8, cookTime: 5, calories: 200, protein: '4g', carbs: '18g', fat: '12g', fiber: '1g',
        availability: 'Available'
    },
    {
        id: 56, name: 'Boli', price: 2500, category: 'snacks', image: 'https://www.chefspencil.com/wp-content/uploads/Boli.jpg',
        description: 'Roasted plantain, often eaten with groundnut.',
        prepTime: 10, cookTime: 15, calories: 180, protein: '1g', carbs: '40g', fat: '0g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 57, name: 'Roasted Corn and Coconut', price: 1000, category: 'snacks', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2am_aFIadxE6URgQQEwx2Dv4mFP3quNGCoQ&s',
        description: 'A popular street food combo.',
        prepTime: 10, cookTime: 15, calories: 180, protein: '2g', carbs: '38g', fat: '2g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 58, name: 'Groundnut (Peanuts)', price: 2000, category: 'snacks', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT70dSMn_Y8f_Q1fYtaaPPSyj5_P0eWcu8u_Q&s',
        description: 'Often roasted and sold in cones.',
        prepTime: 5, cookTime: 5, calories: 190, protein: '6g', carbs: '8g', fat: '16g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 59, name: 'Ofada Rice and Ayamase', price: 10000, category: 'rice', image: 'https://ogbongeh.com/wp-content/uploads/2025/03/Demand-gen-1200-x-628-2025-03-26T120347.677.png',
        description: 'Indigenous rice with a spicy green pepper sauce.',
        prepTime: 15, cookTime: 20, calories: 370, protein: '7g', carbs: '62g', fat: '11g', fiber: '2g',
        availability: 'Available'
    },
    {
        id: 60, name: 'Yam Porridge (Asaro)', price: 6000, category: 'rice', image: 'https://terracubes.net/wp-content/uploads/2023/10/Yam-Porridge-700x400.png',
        description: 'Mashed yam cooked in spicy red sauce.',
        prepTime: 15, cookTime: 25, calories: 370, protein: '6g', carbs: '60g', fat: '10g', fiber: '3g',
        availability: 'Available'
    }
];

// --- Added missing menu item: Jollof Rice ---
meals.push({
    id: 1001,
    name: 'Jollof Rice',
    price: 6500,
    category: 'rice',
    image: 'https://cdn.jwplayer.com/v2/media/BRU94itM/poster.jpg?width=720',
    description: 'Tomato-based rice dish cooked with spices.',
    prepTime: 15,
    cookTime: 25,
    calories: 380,
    protein: '6g',
    carbs: '68g',
    fat: '8g',
    fiber: '2g',
    availability: 'Available'
});

const ingredients = [
    { id: 'oha', name: 'Oha Leaf', price: 2000, image: 'https://www.supermart.ng/cdn/shop/files/ONMspxspz024_20_2.jpg?v=1689074875', description: 'Fresh Oha leaves for traditional Igbo soups' },
    { id: 'palm-oil', name: 'Palm Oil', price: 5000, image: 'https://www.greenqueen.com.hk/wp-content/uploads/2025/02/palm-oil-vs-vegetable-deforestation-climate-change-soybean-canola-1.png', description: 'Premium red palm oil from Nigeria' },
    { id: 'bitterleaf', name: 'Bitterleaf', price: 2000, image: 'https://www.afroasiaa.com/cdn/shop/files/cut-bitter-leaf-uncut-bitter-leaf-856048_1200x.webp?v=1725545317', description: 'Fresh bitterleaf for soups' },
    { id: 'ogbono', name: 'Ogbono Seed', price: 10000, image: 'https://stermart.com/wp-content/uploads/2021/09/stermart-marketplace-ogbono-seeds-mango-seends-african-nigerian-food-buy-and-sell-in-usa-canada-online-grocery-store.jpeg', description: 'Ogbono seeds for thickening soups' },
    { id: 'pounded-yam', name: 'Pounded Yam Mix', price: 7000, image: 'https://afrifoodsa.co.za/wp-content/uploads/2020/02/Ayoola-Pounded-Yam.jpg', description: 'Ready-to-cook pounded yam flour' },
    { id: 'semovita', name: 'Semovita', price: 7000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbAigwyAWrYJAyTh_-W14PVfPDCA8lLKhxVw&s', description: 'Semovita swallow flour' },
    { id: 'semolina', name: 'Semolina', price: 7000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT17lwpSlbkOZ9JUYp0htVQcCt406PitcCx2g&s', description: 'Semolina swallow flour' },
    { id: 'stockfish', name: 'Stockfish', price: 10000, image: 'https://www.utchyglobalservices.com/wp-content/uploads/2018/05/Stockfishcut.jpg', description: 'Dried Norwegian stockfish' },
    { id: 'crayfish', name: 'Crayfish', price: 5000, image: 'https://api.globy.com/public/market/670661bd99565d004502f3af/photos/67078a5b0a0178005fab4b5c/67078a5b0a0178005fab4b5c_lg.webp', description: 'Ground crayfish powder' },
    { id: 'beans', name: 'Beans', price: 10000, image: 'https://media.licdn.com/dms/image/v2/D4D12AQHyGyt50Ze1fQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1697615006865?e=2147483647&v=beta&t=cNTjH4kow_KEfbFDo6Rwh7pctX8g-dN0lTqqdYt2C5I', description: 'Nigerian brown beans' },
    { id: 'beans-flour', name: 'Beans Flour', price: 10000, image: 'https://africannatural.s3.us-east-1.amazonaws.com/product/138/U98M5DfOC9SL0MSsldwFvoerxftegIdYttfCTwyH.webp', description: 'Flour made from beans for moi moi and akara' },
    { id: 'garri', name: 'Garri', price: 6000, image: 'https://udyfoods.com/wp-content/uploads/2021/10/WhatsApp-Image-2025-03-03-at-12.06.12.jpeg', description: 'Granulated cassava for eba' },
    { id: 'egusi', name: 'Egusi', price: 10000, image: 'https://www.neogric.com/wp-content/uploads/2025/04/Neogric-Melon-Seeds-2.jpg', description: 'Melon seeds for egusi soup' },
    { id: 'dried-fish', name: 'Dried Fish (Azu Mangala)', price: 10000, image: 'https://afrimartuk.com/wp-content/uploads/2023/07/WhatsApp-Image-2023-07-29-at-11.10.29-AM-1.jpeg', description: 'Traditional dried fish for soups' },
    { id: 'seasoning-cubes', name: 'Seasoning Cubes', price: 10000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFWZLyA3tXaibcjyEunozEj8rMJy-UcRA5PA&s', description: 'Popular seasoning cubes for Nigerian cooking' },
    { id: 'spices', name: 'Spices', price: 2500, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxLHKSE0ZR2PvT4yRFGYgiRjm1gsfLAT1RQw&s', description: 'Assorted Nigerian spices' },
    { id: 'native-spice', name: 'Native Spice (Suya Mix)', price: 2000, image: 'https://immaculateruemu.com/wp-content/uploads/2019/02/The-Nigerian-Suya-Spice-Mix-Mix.bk_-500x375.jpeg', description: 'Traditional suya spice mix' },
    { id: 'tomato-paste', name: 'Tomato Paste', price: 1500, image: 'https://waziri.ng/wp-content/uploads/2023/12/Gino-Pepper-and-Onion-Tomato-Paste-65g-x-50-1.jpg', description: 'Tomato paste for stews and jollof' },
    { id: 'yam', name: 'Yam', price: 10000, image: 'https://media.post.rvohealth.io/wp-content/uploads/2023/09/whole-and-halved-raw-african-yam-732x549-thumbnail.jpg', description: 'Whole African yam tuber' },
    { id: 'okpa', name: 'Okpa', price: 10000, image: 'https://i.ebayimg.com/images/g/soAAAOSwnFJf6kUI/s-l1200.jpg', description: 'Okpa (Bambara nut) for pudding' },
    { id: 'abacha', name: 'Abacha', price: 10000, image: 'https://humblesagefood.com/wp-content/uploads/2024/05/Abacha.jpg', description: 'African salad made from cassava' },
    { id: 'cowskin', name: 'Cowskin (Kpomo)', price: 2500, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEL2hKE01Gtazd8dOhUJKjT32b8c8pp9psgg&s', description: 'Edible cowskin, also called kpomo' },
    { id: 'ugu', name: 'Ugu (Fluted Pumpkin Leaf)', price: 2000, image: 'https://foodieng.com/wp-content/uploads/2022/05/ugu-leaves-2.jpg', description: 'Ugu leaves for soups and stews' },
    { id: 'utazzi', name: 'Utazzi', price: 2000, image: 'https://lh5.googleusercontent.com/proxy/sj4sc52ysSSpCdTB5Ag9uSKxADB0wSefnqWltRXvZR7arPXRk6DiwsdWliL4Eyy2Vob0O20IzKhUvnaeGmWvCe79aiLmT35oww', description: 'Utazzi leaves for bitter soups' },
    { id: 'scent-leaves', name: 'Scent Leaves', price: 2000, image: 'https://i0.wp.com/1qfoodplatter.com/wp-content/uploads/2015/11/effirin.jpg?fit=721%2C479&ssl=1', description: 'Aromatic scent leaves (effirin)' },
    { id: 'water-leaf', name: 'Water Leaf', price: 2000, image: 'https://gfb.global.ssl.fastly.net/wp-content/uploads/2016/07/15-Worthy-Benefits-of-Waterleaf-Talinum-triangulare.jpg', description: 'Waterleaf for soups' },
    { id: 'curry-leaves', name: 'Curry Leaves', price: 2000, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSopYaq94NU1mXfRHfGgNpAy784oC2baLwO0w&s', description: 'Curry leaves for flavoring' },
    { id: 'afang-leaf', name: 'Afang Leaf', price: 2000, image: 'https://mltabfh9dl60.i.optimole.com/w:1080/h:1080/q:mauto/ig:avif/https://whudeysell.com/wp-content/uploads/2017/12/WDS-HP-13.png', description: 'Afang (okazi) leaf for soups' }
];

// DOM Elements
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartSummary = document.getElementById('cartSummary');
const mealsGrid = document.getElementById('mealsGrid');
const ingredientsGrid = document.getElementById('ingredientsGrid');
const consultationModal = document.getElementById('consultationModal');
const checkoutModal = document.getElementById('checkoutModal');
const successMessage = document.getElementById('successMessage');

// Initialize App
document.addEventListener('DOMContentLoaded', function () {
    initializeNavigation();
    renderMeals();
    renderIngredients();
    initializeFilters();
    initializeModals();
    updateCartDisplay();
});

// Navigation
function initializeNavigation() {
    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSection = e.target.getAttribute('href').substring(1);
            if (targetSection !== 'cart') {
                showSection(targetSection);
            } else {
                showSection('cart');
            }
            navMenu.classList.remove('active');
        });
    });
}

// Section Navigation
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section, #home').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.style.display = 'block';
        targetSection.classList.add('active');
        currentSection = sectionName;
    }

    // Update cart count when showing cart
    if (sectionName === 'cart') {
        updateCartDisplay();
    }
}

// Render Meals
function renderMeals(category = 'all') {
    const filteredMeals = category === 'all' ? meals : meals.filter(meal => meal.category === category);

    mealsGrid.innerHTML = filteredMeals.map(meal => `
        <div class="meal-card" data-category="${meal.category}" data-mealid="${meal.id}">
            <div class="meal-image">
                <img src="${meal.image}" alt="${meal.name}" onerror="this.onerror=null;this.src='images/placeholder.jpg';" />
            </div>
            <div class="meal-info">
                <h3>${meal.name}</h3>
                <p>${meal.description}</p>
                <div class="meal-price">${meal.price.toLocaleString()} RWF</div>
                <button class="btn btn-primary add-to-cart" onclick="addToCart(${meal.id}, 'meal');event.stopPropagation();">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
    // Add click event for meal details
    document.querySelectorAll('.meal-card').forEach(card => {
        card.addEventListener('click', function (e) {
            const mealId = this.getAttribute('data-mealid');
            showMealDetails(mealId);
        });
    });
    // Show meal details modal
    function showMealDetails(mealId) {
        const meal = meals.find(m => m.id == mealId);
        if (!meal) return;
        const modal = document.getElementById('mealDetailsModal');
        const body = document.getElementById('mealDetailsBody');
        const title = document.getElementById('mealDetailsTitle');
        if (!modal || !body || !title) return;
        title.textContent = meal.name + ' Details';
        body.innerHTML = `
                <div style="font-size:1.1rem;margin-bottom:10px;"><strong>Price:</strong> ${meal.price.toLocaleString(undefined, { minimumFractionDigits: 2 })} RWF</div>
                <div style="margin-bottom:10px;"><strong>Availability:</strong> ${meal.availability || 'Available'}</div>
                <div style="margin-bottom:10px;"><strong>Prep Time:</strong> ${meal.prepTime ? meal.prepTime + ' min' : '-'} &nbsp; <strong>Cook Time:</strong> ${meal.cookTime ? meal.cookTime + ' min' : '-'}</div>
                <div style="margin-bottom:10px;">
                    <strong>Nutrition:</strong><br>
                    Calories: ${meal.calories} &nbsp; Protein: ${meal.protein} &nbsp; Carbs: ${meal.carbs} &nbsp; Fat: ${meal.fat} &nbsp; Fiber: ${meal.fiber}
                </div>
                <div style="margin-bottom:10px;">${meal.description}</div>
            `;
        modal.style.display = 'block';
    }

    // Close meal details modal
    document.addEventListener('DOMContentLoaded', function () {
        const modal = document.getElementById('mealDetailsModal');
        const closeBtn = document.getElementById('closeMealDetails');
        if (closeBtn && modal) {
            closeBtn.addEventListener('click', function () {
                modal.style.display = 'none';
            });
        }
        window.addEventListener('click', function (e) {
            if (modal && e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

// Render Ingredients
function renderIngredients() {
    ingredientsGrid.innerHTML = ingredients.map(ingredient => `
        <div class="ingredient-card">
            <div class="ingredient-image">
                ${ingredient.image ? `<img src="${ingredient.image}" alt="${ingredient.name}" style="width:100px;height:100px;object-fit:cover;border-radius:8px;">` : ''}
            </div>
            <div class="ingredient-info">
                <h3>${ingredient.name}</h3>
                <p>${ingredient.description}</p>
                <div class="ingredient-price">${ingredient.price.toLocaleString()} RWF/kg</div>
                <div class="quantity-selector" style="margin: 15px 0;">
                    <label>Quantity (kg):</label>
                    <select id="qty-${ingredient.id}" style="width: 100%; padding: 8px; margin-top: 5px; border: 1px solid #ddd; border-radius: 5px;">
                        <option value="1">1 kg</option>
                        <option value="2">2 kg</option>
                        <option value="5">5 kg</option>
                        <option value="10">10 kg</option>
                    </select>
                </div>
                <button class="btn btn-primary add-to-cart" onclick="addIngredientToCart('${ingredient.id}')">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize Filters
function initializeFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Update active filter
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Filter meals
            const category = e.target.getAttribute('data-category');
            renderMeals(category);
        });
    });
}

// Add to Cart Functions
function addToCart(id, type) {
    let item;
    if (type === 'meal') {
        item = meals.find(meal => meal.id === id);
        if (item) {
            const existingItem = cart.find(cartItem => cartItem.id === id && cartItem.type === 'meal');
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    // No emoji for meals
                    quantity: 1,
                    type: 'meal'
                });
            }
            updateCartCount();
            showSuccessMessage(`${item.name} added to cart!`);
        }
    }
}

function addIngredientToCart(id) {
    const ingredient = ingredients.find(ing => ing.id === id);
    const quantity = parseInt(document.getElementById(`qty-${id}`).value);

    if (ingredient) {
        const existingItem = cart.find(cartItem => cartItem.id === id && cartItem.type === 'ingredient');
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: ingredient.id,
                name: ingredient.name,
                price: ingredient.price,
                emoji: ingredient.emoji,
                quantity: quantity,
                type: 'ingredient'
            });
        }
    }

    updateCartCount();
    showSuccessMessage(`${quantity}kg ${ingredient.name} added to cart!`);
}

// Cart Functions
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

function updateCartDisplay() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty. Start by adding some delicious meals!</p>';
        cartSummary.style.display = 'none';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image" data-emoji="${item.emoji}"></div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price.toLocaleString()} RWF ${item.type === 'ingredient' ? 'per kg' : 'each'}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', '${item.type}', -1)">-</button>
                        <span style="margin: 0 15px; font-weight: bold;">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', '${item.type}', 1)">+</button>
                        <button class="btn" onclick="removeFromCart('${item.id}', '${item.type}')" style="margin-left: 15px; background: #ff6b6b; color: white; padding: 5px 10px; font-size: 0.8rem;">Remove</button>
                    </div>
                </div>
            `).join('');

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = 2000;
    const total = subtotal + delivery;

    document.getElementById('subtotal').textContent = `${subtotal.toLocaleString()} RWF`;
    document.getElementById('total').textContent = `${total.toLocaleString()} RWF`;
    document.getElementById('checkoutTotal').textContent = `${total.toLocaleString()} RWF`;

    cartSummary.style.display = 'block';
}

function updateQuantity(id, type, change) {
    const item = cart.find(cartItem => cartItem.id === id && cartItem.type === type);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id, type);
        } else {
            updateCartDisplay();
            updateCartCount();
        }
    }
}

function removeFromCart(id, type) {
    cart = cart.filter(item => !(item.id === id && item.type === type));
    updateCartDisplay();
    updateCartCount();
}

// Consultation Booking
function bookConsultation(packageType) {
    const packages = {
        basic: { name: 'Basic Consultation', price: '15,000 RWF' },
        premium: { name: 'Premium Package', price: '25,000 RWF' },
        complete: { name: 'Complete Care', price: '30,000 RWF' }
    };

    document.getElementById('selectedPackage').value = `${packages[packageType].name} - ${packages[packageType].price}`;
    consultationModal.style.display = 'block';
}

// Checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showSuccessMessage('Your cart is empty!');
        return;
    }
    checkoutModal.style.display = 'block';
}

// Initialize Modals
function initializeModals() {
    // Close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', (e) => {
            e.target.closest('.modal').style.display = 'none';
        });
    });

    // Click outside to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Form submissions
    document.getElementById('consultationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        consultationModal.style.display = 'none';
        showSuccessMessage('Consultation booked successfully! We will contact you soon.');
    });

    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        checkoutModal.style.display = 'none';
        cart = [];
        updateCartCount();
        updateCartDisplay();
        showSuccessMessage('Order placed successfully! We will deliver within 30-45 minutes.');
    });
}

// Success Message
function showSuccessMessage(message) {
    document.getElementById('successText').textContent = message;
    successMessage.style.display = 'flex';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
}

// Smooth scroll for buttons
function smoothScroll(target) {
    document.getElementById(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Add loading states for better UX
function addLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'Adding...';
    button.disabled = true;
    button.classList.add('loading');

    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('loading');
    }, 1000);
}

// Update add to cart buttons to show loading
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart')) {
        addLoadingState(e.target);
    }
});

// Set minimum date for consultation booking
document.addEventListener('DOMContentLoaded', function () {
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
});

// Progressive Web App features
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// --- Nutrition Tracking System ---

// Nutrition data storage
let nutritionData = {
    dailyLog: {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
    },
    goals: {
        calories: 2000,
        protein: 50,
        carbs: 250,
        fat: 65
    },
    weight: {
        current: 70,
        target: 65
    },
    weeklyData: []
};

// Initialize nutrition tracking
document.addEventListener('DOMContentLoaded', function () {
    loadNutritionData();
    initializeNutritionTracking();
    updateNutritionDisplay();
});

// Load nutrition data from localStorage
function loadNutritionData() {
    const saved = localStorage.getItem('dwm-nutrition-data');
    if (saved) {
        try {
            nutritionData = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading nutrition data:', e);
        }
    }
}

// Save nutrition data to localStorage
function saveNutritionData() {
    localStorage.setItem('dwm-nutrition-data', JSON.stringify(nutritionData));
}

// Initialize nutrition tracking functionality
function initializeNutritionTracking() {
    // Food search functionality
    const foodSearch = document.getElementById('foodSearch');
    if (foodSearch) {
        foodSearch.addEventListener('input', function () {
            const query = this.value.toLowerCase();
            if (query.length > 2) {
                searchFoods(query);
            } else {
                hideSearchResults();
            }
        });
    }

    // Meal tab functionality
    document.querySelectorAll('.meal-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            const mealType = this.getAttribute('data-meal');
            switchMealTab(mealType);
        });
    });

    // Load saved goals
    loadGoals();
}

// Search foods from meals data
function searchFoods(query) {
    const results = meals.filter(meal =>
        meal.name.toLowerCase().includes(query)
    ).slice(0, 5);

    displaySearchResults(results);
}

// Display search results
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('foodSearchResults');
    if (!resultsContainer) return;

    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="search-result-item">No foods found</div>';
    } else {
        resultsContainer.innerHTML = results.map(meal => `
            <div class="search-result-item" onclick="addMealToLog('${meal.name}', ${meal.calories}, ${meal.protein.replace('g', '')}, ${meal.carbs.replace('g', '')}, ${meal.fat.replace('g', '')})">
                <strong>${meal.name}</strong><br>
                <small>${meal.calories} cal | ${meal.protein} | ${meal.carbs} | ${meal.fat}</small>
            </div>
        `).join('');
    }

    resultsContainer.style.display = 'block';
}

// Hide search results
function hideSearchResults() {
    const resultsContainer = document.getElementById('foodSearchResults');
    if (resultsContainer) {
        resultsContainer.style.display = 'none';
    }
}

// Add meal to log
function addMealToLog(name, calories, protein, carbs, fat) {
    const food = {
        id: Date.now(),
        name: name,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat,
        servingSize: '1 serving',
        timestamp: new Date().toISOString()
    };

    // Add to breakfast by default (can be changed by user)
    nutritionData.dailyLog.breakfast.push(food);

    saveNutritionData();
    updateNutritionDisplay();
    hideSearchResults();

    // Clear search
    const foodSearch = document.getElementById('foodSearch');
    if (foodSearch) foodSearch.value = '';

    showSuccessMessage(`${name} added to breakfast!`);
}

// Add custom food
function addCustomFood() {
    const name = document.getElementById('customFoodName').value;
    const calories = parseFloat(document.getElementById('customCalories').value) || 0;
    const protein = parseFloat(document.getElementById('customProtein').value) || 0;
    const carbs = parseFloat(document.getElementById('customCarbs').value) || 0;
    const fat = parseFloat(document.getElementById('customFat').value) || 0;
    const servingSize = document.getElementById('servingSize').value || '1 serving';

    if (!name || calories === 0) {
        showSuccessMessage('Please enter a food name and calories');
        return;
    }

    const food = {
        id: Date.now(),
        name: name,
        calories: calories,
        protein: protein,
        carbs: carbs,
        fat: fat,
        servingSize: servingSize,
        timestamp: new Date().toISOString()
    };

    nutritionData.dailyLog.breakfast.push(food);

    saveNutritionData();
    updateNutritionDisplay();

    // Clear form
    document.getElementById('customFoodName').value = '';
    document.getElementById('customCalories').value = '';
    document.getElementById('customProtein').value = '';
    document.getElementById('customCarbs').value = '';
    document.getElementById('customFat').value = '';
    document.getElementById('servingSize').value = '';

    showSuccessMessage(`${name} added to breakfast!`);
}

// Switch meal tabs
function switchMealTab(mealType) {
    // Update active tab
    document.querySelectorAll('.meal-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-meal="${mealType}"]`).classList.add('active');

    // Update active meal list
    document.querySelectorAll('.meal-list').forEach(list => {
        list.classList.remove('active');
    });
    document.getElementById(`${mealType}Meals`).classList.add('active');
}

// Update nutrition display
function updateNutritionDisplay() {
    const totals = calculateDailyTotals();

    // Update summary stats
    document.getElementById('todayCalories').textContent = Math.round(totals.calories);
    document.getElementById('todayProtein').textContent = Math.round(totals.protein) + 'g';
    document.getElementById('todayCarbs').textContent = Math.round(totals.carbs) + 'g';
    document.getElementById('todayFat').textContent = Math.round(totals.fat) + 'g';

    // Update progress bars
    updateProgressBar('caloriesProgress', totals.calories, nutritionData.goals.calories);
    updateProgressBar('proteinProgress', totals.protein, nutritionData.goals.protein);
    updateProgressBar('carbsProgress', totals.carbs, nutritionData.goals.carbs);
    updateProgressBar('fatProgress', totals.fat, nutritionData.goals.fat);

    // Update meal lists
    updateMealLists();
}

// Calculate daily totals
function calculateDailyTotals() {
    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };

    Object.values(nutritionData.dailyLog).forEach(mealType => {
        mealType.forEach(food => {
            totals.calories += food.calories;
            totals.protein += food.protein;
            totals.carbs += food.carbs;
            totals.fat += food.fat;
        });
    });

    return totals;
}

// Update progress bar
function updateProgressBar(elementId, current, target) {
    const progressBar = document.getElementById(elementId);
    if (progressBar) {
        const percentage = Math.min((current / target) * 100, 100);
        progressBar.style.width = percentage + '%';
    }
}

// Update meal lists
function updateMealLists() {
    Object.keys(nutritionData.dailyLog).forEach(mealType => {
        const container = document.getElementById(`${mealType}Meals`);
        if (container) {
            container.innerHTML = nutritionData.dailyLog[mealType].map(food => `
                <div class="meal-item">
                    <div class="meal-item-info">
                        <div class="meal-item-name">${food.name}</div>
                        <div class="meal-item-nutrition">
                            ${food.calories} cal | ${food.protein}g protein | ${food.carbs}g carbs | ${food.fat}g fat
                        </div>
                    </div>
                    <div class="meal-item-actions">
                        <button class="remove-meal" onclick="removeFoodFromLog('${mealType}', ${food.id})">Remove</button>
                    </div>
                </div>
            `).join('');
        }
    });
}

// Remove food from log
function removeFoodFromLog(mealType, foodId) {
    nutritionData.dailyLog[mealType] = nutritionData.dailyLog[mealType].filter(food => food.id !== foodId);
    saveNutritionData();
    updateNutritionDisplay();
    showSuccessMessage('Food removed from log');
}

// Load goals
function loadGoals() {
    document.getElementById('goalCalories').value = nutritionData.goals.calories;
    document.getElementById('goalProtein').value = nutritionData.goals.protein;
    document.getElementById('goalCarbs').value = nutritionData.goals.carbs;
    document.getElementById('goalFat').value = nutritionData.goals.fat;
    document.getElementById('currentWeight').value = nutritionData.weight.current;
    document.getElementById('targetWeight').value = nutritionData.weight.target;
}

// Update goals
function updateGoals() {
    nutritionData.goals.calories = parseInt(document.getElementById('goalCalories').value);
    nutritionData.goals.protein = parseInt(document.getElementById('goalProtein').value);
    nutritionData.goals.carbs = parseInt(document.getElementById('goalCarbs').value);
    nutritionData.goals.fat = parseInt(document.getElementById('goalFat').value);

    saveNutritionData();
    updateNutritionDisplay();
    showSuccessMessage('Nutrition goals updated!');
}

// Update weight
function updateWeight() {
    nutritionData.weight.current = parseFloat(document.getElementById('currentWeight').value);
    nutritionData.weight.target = parseFloat(document.getElementById('targetWeight').value);

    saveNutritionData();
    showSuccessMessage('Weight updated!');
}

// Clear daily log
function clearDailyLog() {
    nutritionData.dailyLog = {
        breakfast: [],
        lunch: [],
        dinner: [],
        snacks: []
    };
    saveNutritionData();
    updateNutritionDisplay();
    showSuccessMessage('Daily log cleared!');
}

// Export nutrition data
function exportNutritionData() {
    const dataStr = JSON.stringify(nutritionData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nutrition-data.json';
    link.click();
    URL.revokeObjectURL(url);
}

// Import nutrition data
function importNutritionData(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedData = JSON.parse(e.target.result);
            nutritionData = importedData;
            saveNutritionData();
            updateNutritionDisplay();
            loadGoals();
            showSuccessMessage('Nutrition data imported successfully!');
        } catch (error) {
            showSuccessMessage('Error importing data. Please check file format.');
        }
    };
    reader.readAsText(file);
}
