// Complete ideas data with detailed information
const ideas = [
  {
    id: 1,
    title: "Title of the Business Idea, 2lines spacing them.",
    intro: "A revolutionary smart mailbox system that connects directly to your smartphone for efficient mail management.",
    description: "This innovative mailbox technology integrates seamlessly with mobile applications to provide real-time notifications when mail arrives. The system includes sensors that detect mail delivery, camera functionality for mail preview, and secure digital locks for package protection. Users can monitor their mail remotely, receive delivery confirmations, and even provide delivery instructions through the connected app. The technology also includes weather protection features and anti-theft mechanisms.",
    image: "images/td1.png",
    price: "₦ 120,000",
    tags: ["Technology", "ICT", "Communication"],
    features: [
      "Real-time mail delivery notifications",
      "Integrated smartphone app connectivity", 
      "Secure digital locking system",
      "Weather-resistant design",
      "Anti-theft security features",
      "Package size detection",
      "Delivery confirmation system"
    ],
    problems: "Missed important mail deliveries, package theft from unsecured mailboxes, inability to monitor mail when away from home, lack of delivery confirmation, and weather damage to mail and packages.",
    impacts: "Increased mail security and peace of mind, reduced package theft by 80%, improved communication between residents and delivery services, enhanced convenience for busy homeowners, and potential for integration with smart home systems.",
    author: {
      name: "Tony",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
      bio: "Tony is a technology enthusiast and IoT developer with 8 years of experience in smart home solutions. He specializes in creating practical tech solutions that solve everyday problems.",
      joinYear: "2016"
    },
    likes: 124,
    bookmarks: 45,
    shares: 28,
    comments: [
      {
        author: "Sarah M.",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b6b5?w=40&h=40&fit=crop&crop=face",
        text: "This is exactly what I need! My packages keep getting stolen."
      }
    ],
    date: "September 15, 2025"
  },
  {
    id: 2,
    title: "Eco-Track App",
    intro: "An intelligent mobile application that helps users track their daily carbon footprint and provides actionable tips for sustainable living.",
    description: "Eco-Track is a comprehensive environmental monitoring app that calculates your carbon footprint based on daily activities including transportation, energy consumption, food choices, and shopping habits. The app uses machine learning algorithms to provide personalized recommendations for reducing environmental impact. It features community challenges, progress tracking, and integration with smart home devices to monitor energy usage.",
    image: "images/td2.png", 
    price: "₦ 105,000",
    tags: ["Ecosystem", "Greenhouse", "Sustainability"],
    features: [
      "Daily carbon footprint calculation",
      "Personalized sustainability recommendations",
      "Community challenges and leaderboards",
      "Smart home device integration",
      "Progress tracking and analytics",
      "Local eco-friendly business directory",
      "Reward system for sustainable actions"
    ],
    problems: "Lack of awareness about personal environmental impact, difficulty in making sustainable lifestyle choices, no easy way to track environmental progress, limited access to eco-friendly alternatives, and insufficient motivation for sustainable behavior.",
    impacts: "Average 25% reduction in personal carbon footprint, increased awareness of environmental impact, promotes sustainable consumer behavior, builds environmentally conscious communities, and contributes to global climate change mitigation efforts.",
    author: {
      name: "Amelia Scott",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b6b5?w=32&h=32&fit=crop&crop=face",
      bio: "Amelia is an environmental scientist and app developer passionate about using technology to combat climate change. She holds a Master's in Environmental Engineering and has developed multiple sustainability-focused applications.",
      joinYear: "2014"
    },
    likes: 148,
    bookmarks: 82,
    shares: 107,
    comments: [
      {
        author: "Rose A.",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
        text: "This feels like a game-changer for schools. Imagine kids learning to reduce carbon impact while earning points!"
      }
    ],
    date: "September 12, 2025"
  },
  {
    id: 3,
    title: "Skill-Swap Hub",
    intro: "A peer-to-peer platform that enables users to exchange skills and knowledge without monetary transactions.",
    description: "Skill-Swap Hub creates a barter economy for skills where users can teach what they know and learn what they need. The platform matches people based on complementary skill sets - for example, someone who wants to learn coding can teach cooking in exchange. The system includes video conferencing tools, progress tracking, skill verification through peer reviews, and a comprehensive matching algorithm.",
    image: "images/td3.png",
    price: "₦ 810,000", 
    tags: ["Skills", "Human Intelligence"],
    features: [
      "Advanced skill matching algorithm",
      "Integrated video conferencing platform",
      "Skill verification and peer review system",
      "Progress tracking and milestone setting",
      "Community forums and discussion groups",
      "Mobile app with offline capability",
      "Multi-language support",
      "Scheduling and calendar integration"
    ],
    problems: "High costs of traditional education and training, limited access to diverse skill development opportunities, underutilization of personal skills and knowledge, difficulty finding qualified instructors for niche skills, and lack of practical, hands-on learning experiences.",
    impacts: "Democratizes access to skill development, creates stronger community connections, reduces educational costs by up to 70%, promotes lifelong learning culture, enables career pivoting and professional development, and builds more skilled and adaptable workforce.",
    author: {
      name: "Charlotte Evans", 
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
      bio: "Charlotte is an educational technology innovator with a background in community development and adult learning. She has facilitated skill-sharing programs in over 15 communities and understands the power of peer-to-peer education.",
      joinYear: "2017"
    },
    likes: 203,
    bookmarks: 89,
    shares: 156,
    comments: [
      {
        author: "Mike D.",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
        text: "Finally! A way to learn guitar while teaching programming. This is brilliant."
      }
    ],
    date: "September 10, 2025"
  },
  {
    id: 4,
    title: "Practical Tips for students",
    intro: "A comprehensive guide and application providing evidence-based strategies to help students improve their academic performance and achieve higher CGPA.",
    description: "This educational resource combines research-backed study techniques with practical tools for academic success. The program includes personalized study schedules, note-taking strategies, exam preparation methods, time management techniques, and stress reduction approaches. It features interactive modules on different learning styles, memory enhancement techniques, and productivity systems specifically designed for students.",
    image: "images/td4.jpg",
    price: "₦ 160,500",
    tags: ["Education", "Academics"],
    features: [
      "Personalized study schedule generator",
      "Evidence-based learning techniques library",
      "Progress tracking and analytics dashboard",
      "Interactive study tools and flashcards",
      "Peer study group matching",
      "Academic mentor connection platform",
      "Stress management and wellness resources",
      "Grade prediction and improvement tracking"
    ],
    problems: "Poor study habits and time management, lack of effective learning strategies, academic stress and performance anxiety, difficulty in maintaining consistent study routine, and limited access to academic support and mentorship.",
    impacts: "Average CGPA improvement of 0.8 points, reduced academic stress and anxiety levels, improved time management and productivity, higher student retention and graduation rates, enhanced critical thinking and learning skills, and better preparation for professional careers.",
    author: {
      name: "Sophia Bennett",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=32&h=32&fit=crop&crop=face",
      bio: "Sophia is an educational psychologist and academic success coach with 10 years of experience helping students achieve their academic goals. She has published research on learning optimization and student performance enhancement.",
      joinYear: "2015"
    },
    likes: 156,
    bookmarks: 78,
    shares: 92,
    comments: [
      {
        author: "Alex K.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        text: "Used these techniques and my GPA went from 2.8 to 3.6 in one semester!"
      }
    ],
    date: "September 8, 2025"
  },
  {
    id: 5,
    title: "Foodie Box",
    intro: "A curated monthly subscription service that delivers authentic snacks and treats from different countries around the world to your doorstep.",
    description: "Foodie Box offers a culinary journey through monthly shipments of carefully selected snacks from various cultures and countries. Each box contains 8-12 unique items with detailed information about their origins, ingredients, and cultural significance. The service partners with local producers and small businesses globally to bring authentic flavors while supporting international communities.",
    image: "images/td5.png",
    price: "₦ 40,000",
    tags: ["Food", "Nutrition", "Health"],
    features: [
      "Monthly curated snack boxes from different countries",
      "Detailed cultural and nutritional information",
      "Dietary restriction customization options",
      "Recipe cards and serving suggestions", 
      "Partnership with local international producers",
      "Mobile app with product tracking and reviews",
      "Community platform for sharing experiences",
      "Educational content about global food cultures"
    ],
    problems: "Limited access to authentic international foods, lack of cultural food education and awareness, difficulty discovering new flavors and cuisines, high costs of international food shopping, and limited support for small international food producers.",
    impacts: "Increased cultural awareness and appreciation, support for small international food businesses, enhanced culinary experiences and palate development, community building around food culture, educational impact on global food traditions, and sustainable income for international producers.",
    author: {
      name: "Mike Williams",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      bio: "Mike is a food entrepreneur and cultural enthusiast who has traveled to over 40 countries exploring local cuisines. He is passionate about connecting cultures through food and supporting small-scale food producers worldwide.",
      joinYear: "2018"
    },
    likes: 78,
    bookmarks: 34,
    shares: 45,
    comments: [
      {
        author: "Lisa R.",
        avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=40&h=40&fit=crop&crop=face",
        text: "Love discovering new flavors every month! Last month's Japanese kit was amazing."
      }
    ],
    date: "September 5, 2025"
  },
  {
    id: 6,
    title: "Better Business with AI tools",
    intro: "An integrated AI-powered business optimization platform that helps companies improve sales performance, increase revenue, and streamline operations.",
    description: "This comprehensive business intelligence platform leverages machine learning and artificial intelligence to analyze business data, predict market trends, optimize pricing strategies, and automate routine tasks. The system includes customer behavior analysis, sales forecasting, inventory management, marketing automation, and performance analytics.",
    image: "images/td6.jpg",
    price: "₦ 810,800",
    tags: ["Artificial Intelligence", "Business", "AI Models"],
    features: [
      "Advanced business analytics and insights",
      "Sales forecasting and trend prediction",
      "Customer behavior analysis and segmentation",
      "Automated marketing campaign optimization",
      "Inventory management and demand planning",
      "Competitive analysis and market intelligence",
      "ROI tracking and performance measurement",
      "Integration with popular business platforms"
    ],
    problems: "Limited access to advanced business analytics for small businesses, difficulty in making data-driven business decisions, inefficient manual processes and operations, lack of predictive insights for business planning, and poor understanding of customer behavior and market trends.",
    impacts: "Average revenue increase of 35% within first year, improved operational efficiency by up to 50%, better customer retention and satisfaction, reduced costs through process automation, enhanced competitive advantage through AI insights, and democratized access to enterprise-level AI tools.",
    author: {
      name: "Chloe Morgan",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=32&h=32&fit=crop&crop=face",
      bio: "Chloe is an AI strategist and business technology consultant with expertise in machine learning applications for business optimization. She has helped over 100 companies integrate AI solutions to improve their operations and profitability.",
      joinYear: "2019"
    },
    likes: 267,
    bookmarks: 143,
    shares: 198,
    comments: [
      {
        author: "David L.",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
        text: "Implemented this in my startup and saw 40% revenue increase in 6 months. Game changer!"
      }
    ],
    date: "September 3, 2025"
  }
];

// Make ideas available globally
window.ideas = ideas;

document.addEventListener("DOMContentLoaded", () => {
  // Get the ID from URL parameters
  const params = new URLSearchParams(window.location.search);
  const ideaId = parseInt(params.get("id"));

  // Find the idea by ID
  const idea = ideas.find(i => i.id === ideaId);

  if (idea) {
    // Populate the page with idea data
    populateIdeaData(idea);
    
    // Add interactivity to action buttons
    setupActionButtons(idea);

  } else {
    // If idea not found, show error message
    document.querySelector(".details-container").innerHTML = `
      <div style="text-align: center; padding: 50px;">
        <h2>Idea Not Found</h2>
        <p>The idea you're looking for doesn't exist or has been removed.</p>
        <a href="explore-idea.html" style="color: #007bff; text-decoration: none;">← Back to Explore Ideas</a>
      </div>
    `;
  }
});

window.ideas = ideas;

document.addEventListener("DOMContentLoaded", () => {
  // Get the ID from URL parameters
  const params = new URLSearchParams(window.location.search);
  const ideaId = parseInt(params.get("id"));

  // Find the idea by ID
  const idea = ideas.find(i => i.id === ideaId);

  if (idea) {
    // Populate the page with idea data
    document.getElementById("idea-title").textContent = idea.title;
    document.getElementById("idea-intro").textContent = idea.intro;
    document.getElementById("idea-description").textContent = idea.description;
    document.getElementById("idea-price").textContent = idea.price;
    document.getElementById("idea-image").src = idea.image;
    document.getElementById("idea-image").alt = idea.title;
    document.getElementById("author-name").textContent = idea.author.name;
    document.getElementById("author-img").src = idea.author.avatar;
    document.getElementById("author-img").alt = idea.author.name;
    document.getElementById("author-bio").textContent = idea.author.bio;
    document.getElementById("likes-count").textContent = idea.likes;

    // Populate features list
    const featuresList = document.getElementById("idea-features");
    featuresList.innerHTML = "";
    idea.features.forEach(feature => {
      const li = document.createElement("li");
      li.textContent = feature;
      featuresList.appendChild(li);
    });

    // Populate problems list
    const problemsList = document.getElementById("idea-problems");
    problemsList.innerHTML = "";
    idea.problems.forEach(problem => {
      const li = document.createElement("li");
      li.textContent = problem;
      problemsList.appendChild(li);
    });

    // Populate impacts list
    const impactsList = document.getElementById("idea-impacts");
    impactsList.innerHTML = "";
    idea.impacts.forEach(impact => {
      const li = document.createElement("li");
      li.textContent = impact;
      impactsList.appendChild(li);
    });

    // Update page title
    document.title = `Mind Market | ${idea.title}`;

  } else {
    // If idea not found, show error message
    document.querySelector(".details-container").innerHTML = `
      <div style="text-align: center; padding: 50px;">
        <h2>Idea Not Found</h2>
        <p>The idea you're looking for doesn't exist or has been removed.</p>
        <a href="explore-idea.html" style="color: #007bff; text-decoration: none;">← Back to Explore Ideas</a>
      </div>
    `;
  }

  // Add interactivity to action buttons
  const likeBtn = document.getElementById("like-btn");
  const commentBtn = document.getElementById("comment-btn");
  const shareBtn = document.getElementById("share-btn");

  if (likeBtn) {
    likeBtn.addEventListener("click", () => {
      // Toggle like functionality
      const currentLikes = parseInt(document.getElementById("likes-count").textContent);
      const newLikes = currentLikes + (likeBtn.classList.contains("liked") ? -1 : 1);
      document.getElementById("likes-count").textContent = newLikes;
      likeBtn.classList.toggle("liked");
      
      // Update button text
      const heartIcon = likeBtn.classList.contains("liked") ? "❤️" : "🤍";
      likeBtn.innerHTML = `${heartIcon} Like (<span id="likes-count">${newLikes}</span>)`;
    });
  }

  if (commentBtn) {
    commentBtn.addEventListener("click", () => {
      // Scroll to comments section or show comment form
      alert("Comment functionality coming soon!");
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      // Copy current URL to clipboard
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Link copied to clipboard!");
      }).catch(() => {
        alert("Unable to copy link. Please copy the URL manually.");
      });
    });
  }
});