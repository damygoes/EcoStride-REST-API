import dotenv from "dotenv";
import mongoose from "mongoose";
import slugify from "slugify";
import { ActivityModel } from "../models/Activity";
import { activityValidationSchema } from "../validations/activityValidator";

dotenv.config();

const mongoConnectUrl = process.env.MONGO_CONNECTION_URL as string;

mongoose
  .connect(mongoConnectUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const seedDatabaseWithMultipleActivities = async () => {
  try {
    const activitiesData = [
      {
        name: "Paris Seine River Morning Run",
        description:
          "Start your day with a refreshing run along the Seine River, embracing the serene beauty of Paris waking up. The early morning light casts a golden hue on the iconic landmarks, offering a unique perspective of the city's architecture and vibrant life. As you follow the meandering paths alongside the river, the sights of Notre Dame, the Eiffel Tower, and the Musée d'Orsay emerge in the tranquil morning atmosphere.\n\nThis run is not just about exercise; it's a cultural immersion, allowing you to experience the historical heart of Paris in peace and quiet. The gentle sounds of the river and the awakening city accompany your strides, providing a meditative experience. This journey offers a perfect blend of urban exploration and physical activity, making it a must-do for visitors and locals alike seeking to start their day invigorated.",
        distance: 5.0,
        elevationGain: 10,
        minimumGrade: 0,
        maximumGrade: 1,
        averageGrade: 0.5,
        timeToComplete: 1800,
        difficultyLevel: "Easy",
        activityType: "Run",
        routeType: "Flat",
        photos: [
          "https://images.unsplash.com/photo-1597743447352-6f50946a3a8f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8UGFyaXMlMjBTZWluZSUyMFJpdmVyfGVufDB8fDB8fHwy",
          "https://images.unsplash.com/photo-1619369464529-fb194de62e9b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UGFyaXMlMjBTZWluZSUyMFJpdmVyfGVufDB8fDB8fHwy",
          "https://images.unsplash.com/photo-1515163982036-aaa6f7018743?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8UGFyaXMlMjBTZWluZSUyMFJpdmVyfGVufDB8fDB8fHwy",
          "https://images.unsplash.com/photo-1541647264876-2f7948f7b0a0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFBhcmlzJTIwU2VpbmUlMjBSaXZlcnxlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1567187156196-005574bcc2e0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fFBhcmlzJTIwU2VpbmUlMjBSaXZlcnxlbnwwfHwwfHx8Mg%3D%3D",
        ],
        tags: ["morning", "river", "Paris"],
        address: {
          city: "Paris",
          state: "Île-de-France",
          country: "France",
        },
        startCoordinate: {
          latitude: 48.8566,
          longitude: 2.3522,
        },
        endCoordinate: {
          latitude: 48.8639,
          longitude: 2.3372,
        },
      },
      {
        name: "Barcelona Beachfront Run",
        description:
          "Experience the vibrant energy of Barcelona with a sunrise run along its beautiful beachfront. This run offers a unique way to see the city come alive, with the Mediterranean Sea on one side and the historic cityscape on the other. The sound of the waves provides a rhythmic backdrop to your run, while the early morning light illuminates the city in a soft glow.\n\nThe route takes you past iconic spots such as the W Hotel and the Barceloneta Beach, allowing for an invigorating start to the day. Whether you're a local looking for a new running route or a visitor wanting to explore Barcelona's beauty, this run offers a perfect combination of scenic views and physical activity. It's an experience that energizes both the body and the spirit, making every stride a memorable part of your Barcelona adventure.",
        distance: 6.0,
        elevationGain: 5,
        minimumGrade: 0,
        maximumGrade: 1,
        averageGrade: 0.2,
        timeToComplete: 2200,
        difficultyLevel: "Easy",
        activityType: "Run",
        routeType: "Flat",
        photos: [],
        tags: ["beach", "Barcelona", "sunrise"],
        address: {
          city: "Barcelona",
          state: "Catalonia",
          country: "Spain",
        },
        startCoordinate: {
          latitude: 41.3781,
          longitude: 2.1899,
        },
        endCoordinate: {
          latitude: 41.3851,
          longitude: 2.1983,
        },
      },
      {
        name: "Rome Historic Run",
        description:
          "Immerse yourself in the heart of ancient history with a run through the historic streets of Rome. As your feet hit the cobblestones, you'll journey past some of the world's most famous ancient monuments and ruins, including the Colosseum, the Roman Forum, and the Pantheon. The early morning provides a serene atmosphere to appreciate these wonders without the crowds, allowing for a personal connection with the past.\n\nThis run is not just a physical challenge but a journey through time, offering insights into Rome's rich history at every turn. The blend of ancient architecture and modern life that characterizes Rome provides a unique backdrop for runners seeking an unforgettable experience. Whether you're a history buff or simply looking to explore Rome in a new way, this run offers a perfect start to your day, filled with inspiration and beauty.",
        distance: 7.0,
        elevationGain: 50,
        minimumGrade: 0,
        maximumGrade: 5,
        averageGrade: 2,
        timeToComplete: 2500,
        difficultyLevel: "Moderate",
        activityType: "Run",
        routeType: "Rolling",
        photos: [],
        tags: ["historic", "Rome", "culture"],
        address: {
          city: "Rome",
          state: "Lazio",
          country: "Italy",
        },
        startCoordinate: {
          latitude: 41.9028,
          longitude: 12.4964,
        },
        endCoordinate: {
          latitude: 41.8965,
          longitude: 12.4823,
        },
      },
      {
        name: "Berlin Tiergarten Run",
        description:
          "Discover the tranquility of Berlin's green heart with a run through the Tiergarten, the city's largest and most beautiful park. As you navigate through its lush pathways and past tranquil ponds, the hustle and bustle of the city fades away, replaced by the peaceful sounds of nature and the occasional historical monument peeking through the trees. This run offers a refreshing escape in the center of the city, perfect for clearing your mind and energizing your body.\n\nThe Tiergarten is not just a park; it's a historical site that tells the story of Berlin through its landscapes and monuments, including the famous Brandenburg Gate at its edge. Running here is like moving through a living museum, where each turn offers a new discovery. Whether you're looking to improve your fitness or simply enjoy a peaceful moment in nature, a run through the Tiergarten promises a memorable and rejuvenating experience.",
        distance: 5.0,
        elevationGain: 30,
        minimumGrade: 0,
        maximumGrade: 3,
        averageGrade: 1.5,
        timeToComplete: 2000,
        difficultyLevel: "Hard",
        activityType: "Run",
        routeType: "Hilly",
        photos: [
          "https://images.unsplash.com/photo-1666095929815-3c32add9fe42?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fEJlcmxpbiUyMFRpZXJnYXJ0ZW58ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1597489024362-2537de7e561d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8QmVybGluJTIwVGllcmdhcnRlbnxlbnwwfHwwfHx8Mg%3D%3D",
        ],
        tags: ["park", "Berlin", "nature"],
        address: {
          city: "Berlin",
          state: "Berlin",
          country: "Germany",
        },
        startCoordinate: {
          latitude: 52.5145,
          longitude: 13.3501,
        },
        endCoordinate: {
          latitude: 52.52,
          longitude: 13.3655,
        },
      },
      {
        name: "Offenburg Vineyard Sunrise Run",
        description:
          "Awake to the beauty of the Baden-Württemberg region with a sunrise run through the picturesque vineyards surrounding Offenburg. The gentle slopes offer not only a physical challenge but also breathtaking views of the sun rising over the hills, casting a warm glow over rows of grapevines. This run provides a unique opportunity to experience the tranquility of the countryside, away from the city's hustle and bustle.\n\nAs you wind through the vineyard paths, the serene environment and fresh morning air invigorate your senses, making every step feel revitalizing. This activity is perfect for those who appreciate nature's beauty and seek a peaceful start to their day. The vineyards of Offenburg are renowned for their scenic landscapes and exquisite wines, offering runners a glimpse into the region's rich viticultural heritage. Embark on this run to enjoy a harmonious blend of fitness, nature, and the simple pleasure of witnessing the day's first light.",
        distance: 8.0,
        elevationGain: 150,
        minimumGrade: 1,
        maximumGrade: 8,
        averageGrade: 3,
        timeToComplete: 2900,
        difficultyLevel: "Moderate",
        activityType: "Run",
        routeType: "Rolling",
        photos: [
          "https://images.unsplash.com/photo-1538587546102-4d5ed7cdb129?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG9mZmVuYnVyZyUyMHZpbmV5YXJkJTIwdHJhaWx8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1558138818-34316d616e44?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fG9mZmVuYnVyZyUyMHZpbmV5YXJkJTIwdHJhaWx8ZW58MHx8MHx8fDI%3D",
        ],
        tags: ["vineyard", "sunrise", "Offenburg"],
        address: {
          city: "Offenburg",
          state: "Baden-Württemberg",
          country: "Germany",
        },
        startCoordinate: {
          latitude: 48.4738,
          longitude: 7.9446,
        },
        endCoordinate: {
          latitude: 48.4694,
          longitude: 7.9404,
        },
      },
      {
        name: "Gifiz Lake Morning Jog",
        description:
          "Embrace the calmness of the early morning with a jog around the serene Gifiz Lake in Offenburg. The quiet waters reflect the beauty of the surrounding greenery, offering a peaceful backdrop for your exercise. As you circle the lake, the soft sounds of nature waking up accompany your steps, providing a tranquil start to the day.\n\nThis jog is perfect for those seeking a moment of peace before diving into the day's activities. The flat terrain around Gifiz Lake is suitable for joggers of all levels, making it a welcoming environment for a gentle morning workout. The picturesque scenery and the fresh, crisp air invigorate your body and mind, setting a positive tone for the rest of your day. Whether you're a local resident or a visitor, a morning jog around Gifiz Lake is an exquisite way to appreciate the natural beauty of Offenburg.",
        distance: 3.5,
        elevationGain: 20,
        minimumGrade: 0,
        maximumGrade: 2,
        averageGrade: 0.5,
        timeToComplete: 1300,
        difficultyLevel: "Easy",
        activityType: "Run",
        routeType: "Flat",
        photos: [
          "https://images.unsplash.com/photo-1557924937-cac9f1662f8a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fEdpZml6JTIwbGFrZXxlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1439066290691-510066268af5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R2lmaXolMjBsYWtlfGVufDB8fDB8fHwy",
        ],
        tags: ["lake", "morning", "Offenburg"],
        address: {
          city: "Offenburg",
          state: "Baden-Württemberg",
          country: "Germany",
        },
        startCoordinate: {
          latitude: 48.476,
          longitude: 7.9614,
        },
        endCoordinate: {
          latitude: 48.4781,
          longitude: 7.9652,
        },
      },
      {
        name: "Cinque Terre Coastal Hike",
        description:
          "Embark on a breathtaking journey along the rugged coastline of Cinque Terre, where the Italian Riviera's natural beauty is on full display. This challenging hike takes you through picturesque villages, terraced vineyards, and panoramic vistas that capture the essence of Italy's stunning landscape. The path winds along the cliffs, offering dramatic views of the turquoise sea below, making every step a memorable adventure.\n\nThe Cinque Terre Coastal Hike is not just a physical challenge; it's an exploration of cultural heritage, showcasing the unique way of life in these historic villages. Along the way, you'll encounter ancient footpaths and stairs carved into the rock, leading to secluded beaches and hidden coves. This hike offers a perfect blend of natural beauty, history, and culture, making it an unforgettable experience for those who seek to immerse themselves in Italy's enchanting coastal scenery.",
        distance: 12.0,
        elevationGain: 500,
        minimumGrade: 3,
        maximumGrade: 15,
        averageGrade: 7,
        timeToComplete: 14400,
        difficultyLevel: "Hard",
        activityType: "Hike",
        routeType: "Hilly",
        photos: [
          "https://images.unsplash.com/photo-1520176098555-7be4abcda8b0?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fENpbnF1ZSUyMFRlcnJlJTIwQ29hc3RhbHxlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1490650191633-406b47bf6e25?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fENpbnF1ZSUyMFRlcnJlJTIwQ29hc3RhbHxlbnwwfHwwfHx8Mg%3D%3D",
        ],
        tags: ["coastal", "Italian Riviera", "Cinque Terre"],
        address: {
          city: "Riomaggiore",
          state: "La Spezia",
          country: "Italy",
        },
        startCoordinate: {
          latitude: 44.099049,
          longitude: 9.737485,
        },

        endCoordinate: {
          latitude: 44.134903,
          longitude: 9.684056,
        },
      },
      {
        name: "Scottish Highlands Exploration",
        description:
          "Dive into the wild beauty of the Scottish Highlands with a hike that takes you through its ancient glens, alongside serene lochs, and over rugged hills. The landscape is a dramatic canvas of natural beauty, where every view tells a story of Scotland's rich history and mystical lore. The route offers a variety of terrains, from gentle paths to challenging climbs, providing an immersive experience in one of the world's most stunning wilderness areas.\n\nThe Scottish Highlands Exploration is more than a hike; it's an adventure that connects you with the heart of Scotland's natural wonders. The tranquility of the lochs, the majesty of the glens, and the awe-inspiring views from the summits make every step rewarding. This hike is a journey through time, offering a glimpse into the land's ancient past and the opportunity to experience the enduring beauty of the Scottish Highlands. It's an essential experience for anyone seeking to explore Scotland's iconic landscapes.",
        distance: 18.0,
        elevationGain: 800,
        minimumGrade: 5,
        maximumGrade: 20,
        averageGrade: 10,
        timeToComplete: 21600,
        difficultyLevel: "Very Hard",
        activityType: "Hike",
        routeType: "Hilly",
        photos: [
          "https://images.unsplash.com/photo-1587247396331-5438951d0d65?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8U2NvdHRpc2glMjBIaWdobGFuZHMlMjAlMjBmb3J0JTIwd2lsbGlhbXxlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1627899473580-6afc5e6ad102?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8U2NvdHRpc2glMjBIaWdobGFuZHMlMjAlMjBmb3J0JTIwd2lsbGlhbXxlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1587247327102-d672e8ed0703?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U2NvdHRpc2glMjBIaWdobGFuZHMlMjAlMjBmb3J0JTIwd2lsbGlhbXxlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1563720584217-8a46cf8931b8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFNjb3R0aXNoJTIwSGlnaGxhbmRzJTIwJTIwZm9ydCUyMHdpbGxpYW18ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1657023420501-cf3936cb3039?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fFNjb3R0aXNoJTIwSGlnaGxhbmRzJTIwJTIwZm9ydCUyMHdpbGxpYW18ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1628295581143-a0587caf63c9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fFNjb3R0aXNoJTIwSGlnaGxhbmRzJTIwJTIwZm9ydCUyMHdpbGxpYW18ZW58MHx8MHx8fDI%3D",
        ],
        tags: ["Highlands", "Scotland", "glens", "lochs"],
        address: {
          city: "Fort William",
          state: "Highland",
          country: "UK",
        },
        startCoordinate: {
          latitude: 56.819817,
          longitude: -5.105218,
        },
        endCoordinate: {
          latitude: 57.273627,
          longitude: -5.513238,
        },
      },
      {
        name: "Swiss Alps Adventure Trail",
        description:
          "Conquer the majestic Swiss Alps on this adventure trail that promises breathtaking views and a test of endurance. The route takes you through some of the most stunning alpine scenery in the world, including pristine meadows, crystal-clear lakes, and towering peaks. The rugged terrain and varying elevations offer a challenging yet rewarding experience for avid hikers and nature lovers.\n\nThis hike is an opportunity to immerse yourself in the natural beauty of the Swiss Alps, with each step bringing a new and awe-inspiring panorama. The trail is a blend of peaceful solitude and raw, untamed nature, offering moments of reflection and exhilaration. For those seeking adventure and a deep connection with the outdoors, the Swiss Alps Adventure Trail is an unforgettable journey through one of the planet's most scenic landscapes.",
        distance: 15.0,
        elevationGain: 1200,
        minimumGrade: 10,
        maximumGrade: 25,
        averageGrade: 12,
        timeToComplete: 28800,
        difficultyLevel: "Extremely Hard",
        activityType: "Hike",
        routeType: "Hilly",
        photos: [
          "https://images.unsplash.com/photo-1634040577860-f7d03811f8b8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U3dpc3MlMjBBbHBzJTIwQWR2ZW50dXJlJTIwVHJhaWwlMjB6ZXJtYXR0fGVufDB8fDB8fHwy",
          "https://images.unsplash.com/photo-1598249390350-ff235039369e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U3dpc3MlMjBBbHBzJTIwQWR2ZW50dXJlJTIwVHJhaWwlMjB6ZXJtYXR0fGVufDB8fDB8fHwy",
          "https://images.unsplash.com/photo-1634040843188-5ca36cf26cc1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U3dpc3MlMjBBbHBzJTIwQWR2ZW50dXJlJTIwVHJhaWwlMjB6ZXJtYXR0fGVufDB8fDB8fHwy",
          "https://images.unsplash.com/photo-1534546584494-57363237b97f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8U3dpc3MlMjBBbHBzJTIwQWR2ZW50dXJlJTIwVHJhaWwlMjB6ZXJtYXR0fGVufDB8fDB8fHwy",
          "https://images.unsplash.com/photo-1517490560101-4ffe479ef5c3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8U3dpc3MlMjBBbHBzJTIwQWR2ZW50dXJlJTIwVHJhaWwlMjB6ZXJtYXR0fGVufDB8fDB8fHwy",
        ],
        tags: ["Alps", "Switzerland", "mountain"],
        address: {
          city: "Zermatt",
          state: "Valais",
          country: "Switzerland",
        },
        startCoordinate: {
          latitude: 46.020713,
          longitude: 7.749117,
        },
        endCoordinate: {
          latitude: 46.010319,
          longitude: 7.784443,
        },
      },
      {
        name: "Provence Lavender Fields Walk",
        description:
          "Stroll through the enchanting lavender fields of Provence, where the air is perfumed with the soothing scent of lavender. This serene hike takes you through the heart of the Provence countryside, showcasing vast expanses of purple blooms under the golden Provençal sun. The picturesque scenery is a feast for the eyes and soul, offering a tranquil escape into nature.\n\nThe walk is not only a sensory delight but also a chance to learn about the cultivation of lavender and its importance to the region's cultural heritage. Along the way, you'll encounter charming farmhouses, ancient villages, and the warm hospitality of the locals. Whether you're a photographer, nature lover, or simply in search of peace, the Provence Lavender Fields Walk offers a timeless journey through one of France's most iconic landscapes.",
        distance: 8.0,
        elevationGain: 200,
        minimumGrade: 0,
        maximumGrade: 5,
        averageGrade: 2,
        timeToComplete: 14400,
        difficultyLevel: "Easy",
        activityType: "Hike",
        routeType: "Flat",
        photos: [
          "https://images.unsplash.com/photo-1673423050436-103ef4d5ecb6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fFByb3ZlbmNlJTIwTGF2ZW5kZXIlMjBGaWVsZHMlMjB2YWxlbnNvbGV8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1530374580925-9d8051b37313?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8UHJvdmVuY2UlMjBMYXZlbmRlciUyMEZpZWxkcyUyMHZhbGVuc29sZXxlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1609170784824-c1b0cc991a7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fFByb3ZlbmNlJTIwTGF2ZW5kZXIlMjBGaWVsZHMlMjB2YWxlbnNvbGV8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1673423050639-a1779551b838?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFByb3ZlbmNlJTIwTGF2ZW5kZXIlMjBGaWVsZHMlMjB2YWxlbnNvbGV8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1593715857983-5531aa640471?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8UHJvdmVuY2UlMjBMYXZlbmRlciUyMEZpZWxkcyUyMHZhbGVuc29sZXxlbnwwfHwwfHx8Mg%3D%3D",
        ],
        tags: ["lavender", "Provence", "France"],
        address: {
          city: "Valensole",
          state: "Provence-Alpes-Côte d'Azur",
          country: "France",
        },
        startCoordinate: {
          latitude: 43.837425,
          longitude: 5.982414,
        },
        endCoordinate: {
          latitude: 43.845679,
          longitude: 6.036707,
        },
      },
      {
        name: "Norwegian Fjords Panorama Hike",
        description:
          "Embark on a majestic journey through the heart of Norway's spectacular fjords with this panoramic hike. The route offers unparalleled views of towering cliffs, deep blue waters, and lush greenery that stretches as far as the eye can see. The serenity of the fjords, combined with the raw beauty of Norway's landscape, provides a hiking experience like no other.\n\nThis hike is a testament to the awe-inspiring power of nature, offering moments of solitude and reflection amidst some of the most breathtaking scenery on the planet. The varying terrains challenge your physical limits while rewarding you with vistas that are nothing short of majestic. Whether you're an experienced hiker or someone looking to immerse themselves in Norway's natural beauty, the Norwegian Fjords Panorama Hike is an unforgettable adventure that showcases the best of what Norway has to offer.",
        distance: 20.0,
        elevationGain: 1000,
        minimumGrade: 5,
        maximumGrade: 20,
        averageGrade: 10,
        timeToComplete: 36000,
        difficultyLevel: "Very Hard",
        activityType: "Hike",
        routeType: "Hilly",
        photos: [
          "https://images.unsplash.com/photo-1535025639604-9a804c092faa?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Tm9yd2VnaWFuJTIwRmpvcmRzJTIwUGFub3JhbWElMjBiZXJnZW58ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1598352174494-9e23bdfe4236?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fE5vcndlZ2lhbiUyMEZqb3JkcyUyMFBhbm9yYW1hJTIwYmVyZ2VufGVufDB8fDB8fHwy",
          "https://images.unsplash.com/photo-1664825381616-5cb8397fd9b1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Tm9yd2VnaWFuJTIwRmpvcmRzfGVufDB8fDB8fHwy",
        ],
        tags: ["fjords", "Norway", "scenic"],
        address: {
          city: "Bergen",
          state: "Vestland",
          country: "Norway",
        },
        startCoordinate: {
          latitude: 60.391263,
          longitude: 5.322054,
        },
        endCoordinate: {
          latitude: 60.472024,
          longitude: 5.486272,
        },
      },
      {
        name: "Amsterdam City Cycling Tour",
        description:
          "Explore the enchanting city of Amsterdam on two wheels with a leisurely bike tour around its iconic canals and historic architecture. The carefully planned route takes you through the heart of the city, offering a unique perspective on Amsterdam's famous landmarks, vibrant streets, and the tranquil beauty of its waterways. Cycling in Amsterdam is not just a mode of transportation; it's a way of life and a fantastic way to immerse yourself in the local culture.\n\nAs you pedal along, you'll discover hidden gems and popular spots, including the Anne Frank House, the Van Gogh Museum, and the bustling markets. The city's flat terrain and extensive bike lanes make this tour accessible for cyclists of all levels, providing an enjoyable and safe experience. Whether you're a seasoned cyclist or a casual rider, the Amsterdam City Cycling Tour offers an unforgettable journey through one of Europe's most bicycle-friendly cities.",
        distance: 10.0,
        elevationGain: 30,
        minimumGrade: 0,
        maximumGrade: 1,
        averageGrade: 0.5,
        timeToComplete: 7200,
        difficultyLevel: "Easy",
        activityType: "Bike",
        routeType: "Flat",
        photos: [
          "https://images.unsplash.com/photo-1676300377705-782b2ee660fe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YW1zdGVyZGFtJTIwY2l0eSUyMGN5Y2xpbmd8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1634123431577-d448e438edb4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YW1zdGVyZGFtJTIwY2l0eSUyMGN5Y2xpbmd8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1651058336212-7cd8d8f8f7b9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YW1zdGVyZGFtJTIwY2l0eSUyMGN5Y2xpbmd8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1672391332571-8360a98ed284?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFtc3RlcmRhbSUyMGNpdHklMjBjeWNsaW5nfGVufDB8fDB8fHwy",
        ],
        tags: ["canals", "Amsterdam", "cycling"],
        address: {
          city: "Amsterdam",
          state: "North Holland",
          country: "Netherlands",
        },
        startCoordinate: {
          latitude: 52.3676,
          longitude: 4.9041,
        },
        endCoordinate: {
          latitude: 52.3738,
          longitude: 4.8909,
        },
      },
      {
        name: "Berlin Wall Trail Ride",
        description:
          "Cycle along the historic Berlin Wall Trail, visiting landmarks and learning about the city's divided past. This ride offers a unique combination of history, culture, and physical activity, taking you along the path where the Berlin Wall once stood. As you pedal through the heart of the city, you'll encounter remnants of the Wall, informative plaques, and memorials that tell the stories of those affected by its presence.\n\nThis moderate ride is suitable for cyclists of all levels and is an excellent way to explore Berlin's history at your own pace. The trail passes through a variety of landscapes, including urban settings, parks, and riverbanks, providing a comprehensive view of the city's transformation. Whether you're a history enthusiast or simply looking for a unique way to experience Berlin, the Berlin Wall Trail Ride offers an insightful and memorable journey through time.",
        distance: 15.0,
        elevationGain: 50,
        minimumGrade: 0,
        maximumGrade: 2,
        averageGrade: 1,
        timeToComplete: 9000,
        difficultyLevel: "Moderate",
        activityType: "Bike",
        routeType: "Flat",
        photos: [
          "https://images.unsplash.com/photo-1478818681424-b20437a61390?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVybGluJTIwd2FsbCUyMHJpZGV8ZW58MHx8MHx8fDI%3D",
        ],
        tags: ["history", "Berlin", "cycling"],
        address: {
          city: "Berlin",
          state: "Berlin",
          country: "Germany",
        },
        startCoordinate: {
          latitude: 52.5163,
          longitude: 13.3777,
        },
        endCoordinate: {
          latitude: 52.5346,
          longitude: 13.4039,
        },
      },
      {
        name: "Copenhagen Lakes Cycling Loop",
        description:
          "Enjoy the natural beauty of Copenhagen with a scenic ride around its picturesque lakes. This leisurely loop is perfect for a sunny afternoon, offering stunning views of the water, lush green spaces, and the city's charming architecture. The well-maintained paths and tranquil surroundings make this route a favorite among locals and visitors alike, providing a peaceful escape from the urban hustle.\n\nThe Copenhagen Lakes Cycling Loop is an ideal way to experience the city's commitment to cycling culture and outdoor living. Along the way, you'll pass by cafes and parks where you can stop, relax, and soak in the atmosphere. Whether you're looking for a leisurely ride or a picturesque backdrop for your cycling adventure, this loop offers a delightful experience that showcases the best of Copenhagen's natural and urban landscapes.",
        distance: 5.0,
        elevationGain: 20,
        minimumGrade: 0,
        maximumGrade: 1,
        averageGrade: 0.4,
        timeToComplete: 3600,
        difficultyLevel: "Easy",
        activityType: "Bike",
        routeType: "Flat",
        photos: [
          "https://images.unsplash.com/photo-1568710865155-3efc686a488c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fENvcGVuaGFnZW4lMjBMYWtlcyUyMEN5Y2xpbmd8ZW58MHx8MHx8fDI%3D",
        ],
        tags: ["lakes", "Copenhagen", "scenic"],
        address: {
          city: "Copenhagen",
          state: "Capital Region",
          country: "Denmark",
        },
        startCoordinate: {
          latitude: 55.6838,
          longitude: 12.5715,
        },
        endCoordinate: {
          latitude: 55.6911,
          longitude: 12.586,
        },
      },
      {
        name: "Loire Valley Castle Tour by Bike",
        description:
          "Discover the splendor of the Loire Valley on a bike tour that takes you through its picturesque landscapes and past its famous châteaux. This ride offers a unique opportunity to explore the rich history and architectural beauty of the region, known as the Garden of France. As you cycle through the verdant countryside, you'll encounter stunning castles, each with its own story and distinctive features.\n\nThe Loire Valley Castle Tour by Bike is an immersive experience that combines physical activity with cultural exploration. The route is dotted with vineyards, historic towns, and majestic rivers, offering diverse scenery that captivates and delights. Whether you're an avid cyclist or a casual rider, this tour provides a leisurely and enchanting way to discover the treasures of the Loire Valley, making it a must-do for anyone visiting the area.",
        distance: 20.0,
        elevationGain: 100,
        minimumGrade: 0,
        maximumGrade: 3,
        averageGrade: 1.5,
        timeToComplete: 14400,
        difficultyLevel: "Moderate",
        activityType: "Bike",
        routeType: "Flat",
        photos: [],
        tags: ["castles", "Loire Valley", "vineyards"],
        address: {
          city: "Tours",
          state: "Centre-Val de Loire",
          country: "France",
        },
        startCoordinate: {
          latitude: 47.3941,
          longitude: 0.6848,
        },
        endCoordinate: {
          latitude: 47.4125,
          longitude: 0.7036,
        },
      },
      {
        name: "Vienna Danube Canal Bike Path",
        description:
          "Explore the vibrant cityscape of Vienna along the Danube Canal on a lively bike ride that showcases urban art and river views. The path runs alongside the water, offering a unique perspective on the city's architecture and the lively culture that thrives along the riverbanks. As you ride, you'll encounter colorful street art, trendy cafes, and pop-up bars, reflecting the dynamic energy of Vienna.\n\nThe Vienna Danube Canal Bike Path is an excellent way to experience the city's contemporary pulse, blending natural beauty with urban flair. The flat terrain makes it accessible for riders of all levels, ensuring a pleasant journey through the heart of Vienna. Whether you're a local looking for a leisurely ride or a visitor seeking to discover the city's modern side, this bike path offers a refreshing and exciting adventure.",
        distance: 12.0,
        elevationGain: 40,
        minimumGrade: 0,
        maximumGrade: 2,
        averageGrade: 0.8,
        timeToComplete: 7200,
        difficultyLevel: "Easy",
        activityType: "Bike",
        routeType: "Flat",
        photos: [
          "https://images.unsplash.com/photo-1706347375662-babc0ef96201?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Vmllbm5hJTIwRGFudWJlfGVufDB8fDB8fHwy",
        ],
        tags: ["Danube", "Vienna", "urban"],
        address: {
          city: "Vienna",
          state: "Vienna",
          country: "Austria",
        },
        startCoordinate: {
          latitude: 48.2082,
          longitude: 16.3738,
        },
        endCoordinate: {
          latitude: 48.2207,
          longitude: 16.3916,
        },
      },
      {
        name: "Offenburg to Durbach Vineyard Tour",
        description:
          "Experience the charm of the Baden wine region with a scenic bike ride from Offenburg to the picturesque town of Durbach. This route takes you through the rolling hills and lush vineyards that characterize the area, offering stunning views and a taste of the region's viticultural heritage. As you pedal, you'll see the landscape change, with vine-covered slopes giving way to quaint villages and historic wineries.\n\nThe Offenburg to Durbach Vineyard Tour is a delightful journey for wine enthusiasts and cyclists alike, providing an opportunity to enjoy the outdoors while exploring the local culture. Along the way, there are plenty of spots to stop, taste the local wines, and enjoy traditional German cuisine. This bike tour is a wonderful way to experience the beauty of the countryside and the rich flavors of the region, making it a memorable part of any visit to Offenburg.",
        distance: 15.0,
        elevationGain: 200,
        minimumGrade: 1,
        maximumGrade: 4,
        averageGrade: 2,
        timeToComplete: 5400,
        difficultyLevel: "Moderate",
        activityType: "Bike",
        routeType: "Flat",
        photos: [
          "https://images.unsplash.com/photo-1590354949849-3e03faa66623?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8T2ZmZW5idXJnJTIwdG8lMjBEdXJiYWNofGVufDB8fDB8fHwy",
          "https://images.unsplash.com/photo-1625494210374-e0c4f778f2c6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8T2ZmZW5idXJnJTIwdG8lMjBEdXJiYWNofGVufDB8fDB8fHwy",
        ],
        tags: ["vineyards", "wine region", "Offenburg", "Durbach"],
        address: {
          city: "Offenburg",
          state: "Baden-Württemberg",
          country: "Germany",
        },
        startCoordinate: {
          latitude: 48.4729,

          longitude: 7.9407,
        },
        endCoordinate: {
          latitude: 48.4816,
          longitude: 8.0553,
        },
      },
      {
        name: "Kinzig River Cycling Path",
        description:
          "Discover the tranquil beauty of the Kinzig River region with a leisurely bike ride along its serene path. This route offers a perfect escape into nature, with picturesque views of the river, lush meadows, and the forested hills of the Black Forest. The gentle flow of the river and the abundant wildlife create a peaceful atmosphere, making this ride a rejuvenating experience.\n\nThe Kinzig River Cycling Path is ideal for families and cyclists looking for a relaxing journey through the countryside. The path is well-maintained and mostly flat, suitable for riders of all ages and abilities. Along the way, there are numerous spots to rest, picnic, and take in the scenic surroundings. Whether you're a local resident seeking a leisurely afternoon ride or a visitor exploring the area, this cycling path offers a delightful way to enjoy the natural beauty of Offenburg and its surroundings.",
        distance: 20.0,
        elevationGain: 50,
        minimumGrade: 0,
        maximumGrade: 2,
        averageGrade: 1,
        timeToComplete: 7200,
        difficultyLevel: "Easy",
        activityType: "Bike",
        routeType: "Flat",
        photos: [],
        tags: ["Kinzig River", "nature", "Offenburg"],
        address: {
          city: "Offenburg",
          state: "Baden-Württemberg",
          country: "Germany",
        },
        startCoordinate: {
          latitude: 48.4774,
          longitude: 7.946,
        },
        endCoordinate: {
          latitude: 48.5234,
          longitude: 7.9943,
        },
      },
      {
        name: "Alpine Pass Challenge",
        description:
          "Test your limits with the Alpine Pass Challenge, a grueling bike ride that tackles the steep climbs and thrilling descents of the Alps. This route is designed for the adventurous cyclist seeking to experience the unparalleled beauty of the mountains while pushing their physical and mental boundaries. The challenging terrain offers a mix of sharp inclines, fast descents, and breathtaking vistas that make every moment on the bike an unforgettable experience.\n\nThe Alpine Pass Challenge is not just a test of endurance; it's an opportunity to immerse yourself in the majestic landscapes of the Alps. Along the way, you'll pass through quaint mountain villages, alongside pristine alpine lakes, and under towering peaks. This ride is a bucket-list adventure for serious cyclists, offering the chance to conquer some of the most iconic and demanding passes in the world of cycling. Prepare for an epic journey that will take you to new heights, both literally and figuratively.",
        distance: 22.0,
        elevationGain: 1500,
        minimumGrade: 8,
        maximumGrade: 15,
        averageGrade: 10,
        timeToComplete: 18000,
        difficultyLevel: "Extremely Hard",
        activityType: "Bike",
        routeType: "Hilly",
        climbCategory: "Hors Categorie (HC)",
        photos: [
          "https://images.unsplash.com/photo-1687860912924-c3a20add936e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZyYW5jZSUyMGN5Y2xpbmd8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/20/curve.JPG?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QWxwaW5lJTIwUGFzcyUyMEZyYW5jZXxlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1571690182136-e18addf6f0c1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QWxwaW5lJTIwUGFzcyUyMEdyZW5vYmxlfGVufDB8fDB8fHwy",
        ],
        tags: ["Alps", "mountain", "challenge"],
        address: {
          city: "Grenoble",
          state: "Auvergne-Rhône-Alpes",
          country: "France",
        },
        startCoordinate: {
          latitude: 45.188529,
          longitude: 5.724524,
        },
        endCoordinate: {
          latitude: 45.18718,
          longitude: 5.721482,
        },
      },
      {
        name: "Pyrenees Explorer Route",
        description:
          "Embark on an epic cycling journey through the Pyrenees, tackling rugged terrain and steep ascents that challenge even the most experienced riders. This route offers a once-in-a-lifetime adventure across one of Europe's most majestic mountain ranges, providing cyclists with the chance to test their endurance against the backdrop of stunning landscapes. The changing scenery, from lush valleys to snow-capped peaks, ensures a dynamic and visually spectacular experience.\n\nThe Pyrenees Explorer Route is a journey of discovery, where each pedal stroke brings you closer to the heart of the mountains' natural beauty and the rich cultural heritage of the region. This challenging route is a testament to the spirit of adventure, inviting cyclists to push their limits and explore the untamed beauty of the Pyrenees. With every climb conquered and descent navigated, the sense of achievement is unparalleled, making this an unforgettable experience for those who dare to take on the challenge.",
        distance: 30.0,
        elevationGain: 2000,
        minimumGrade: 7,
        maximumGrade: 12,
        averageGrade: 9,
        timeToComplete: 24000,
        difficultyLevel: "Very Hard",
        activityType: "Bike",
        routeType: "Hilly",
        climbCategory: "One",
        photos: [
          "https://images.unsplash.com/photo-1664692326670-580082cc070b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cHlyZW5uZXMlMjBhbmRvcmF8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1600403477955-2b8c2cfab221?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fHB5cmVubmVzJTIwY3ljbGluZ3xlbnwwfHwwfHx8Mg%3D%3D",
        ],
        tags: ["Pyrenees", "adventure", "scenic"],
        address: {
          city: "Andorra la Vella",
          state: "Andorra la Vella",
          country: "Andorra",
        },
        startCoordinate: {
          latitude: 42.506317,
          longitude: 1.521835,
        },
        endCoordinate: {
          latitude: 42.508652,
          longitude: 1.531835,
        },
      },
      {
        name: "Tuscany Hills Cycling Tour",
        description:
          "Journey through the heart of Tuscany on a cycling tour that weaves through the hilly terrain, offering views of vineyards, olive groves, and historic villages. This tour captures the essence of Tuscany, with its breathtaking landscapes and rich cultural heritage. The rolling hills provide a challenging ride, but the rewards are unparalleled, with every turn revealing the picturesque beauty of the Italian countryside.\n\nThe Tuscany Hills Cycling Tour is an immersive experience that combines physical activity with cultural exploration. Along the route, you'll have the opportunity to visit medieval towns, sample local wines, and enjoy the warm hospitality of the Tuscan people. This tour is a celebration of Tuscany's natural beauty, culinary delights, and artistic legacy, making it a must-do for anyone seeking to experience the very best of Italy on two wheels.",
        distance: 25.0,
        elevationGain: 1200,
        minimumGrade: 5,
        maximumGrade: 10,
        averageGrade: 7,
        timeToComplete: 15000,
        difficultyLevel: "Hard",
        activityType: "Bike",
        routeType: "Hilly",
        climbCategory: "Two",
        photos: [
          "https://images.unsplash.com/photo-1563036535-e86d8444e157?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dHVzY2FueSUyMGZsb3JlbmNlJTIwcm9hZCUyMGJpa2VzfGVufDB8fDB8fHwy",
          "https://images.unsplash.com/photo-1516108317508-6788f6a160e4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dHVzY2FueSUyMGZsb3JlbmNlJTIwaGlsbHN8ZW58MHx8MHx8fDI%3D",
        ],
        tags: ["Tuscany", "vineyards", "historic"],
        address: {
          city: "Florence",
          state: "Tuscany",
          country: "Italy",
        },
        startCoordinate: {
          latitude: 43.76956,
          longitude: 11.255814,
        },
        endCoordinate: {
          latitude: 43.771051,
          longitude: 11.248621,
        },
      },
      {
        name: "Lake District Passes Ride",
        description:
          "Experience the raw beauty of the Lake District with a challenging ride through its most scenic passes. This route takes you on an unforgettable journey through the heart of the national park, where serene lakes and rugged mountain passes create a stunning backdrop for an exhilarating cycling adventure. The steep climbs and descents will test your stamina, but the reward is the unparalleled beauty of the Lake District's landscapes.\n\nThis ride is an opportunity to connect with the natural splendor of the area, passing by iconic lakes and through charming villages that dot the countryside. The Lake District Passes Ride is perfect for cyclists looking for a challenging route that combines physical exertion with the tranquility of nature. It's a memorable way to explore one of the UK's most beloved national parks, offering breathtaking views and a sense of achievement with every pedal stroke.",
        distance: 18.0,
        elevationGain: 1000,
        minimumGrade: 6,
        maximumGrade: 14,
        averageGrade: 8,
        timeToComplete: 12000,
        difficultyLevel: "Moderate",
        activityType: "Bike",
        routeType: "Hilly",
        climbCategory: "Three",
        photos: [
          "https://images.unsplash.com/photo-1544126981-fbb61112b421?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGN1bWJyaWElMjBtb3VudGFpbnN8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1638798169930-b3bff5bb63f8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3VtYnJpYSUyMG1vdW50YWluc3xlbnwwfHwwfHx8Mg%3D%3D",
        ],
        tags: ["Lake District", "passes", "lakes"],
        address: {
          city: "Keswick",
          state: "Cumbria",
          country: "UK",
        },
        startCoordinate: {
          latitude: 54.601276,
          longitude: -3.134706,
        },
        endCoordinate: {
          latitude: 54.609714,
          longitude: -3.141952,
        },
      },
      {
        name: "Scottish Highlands Gravel Trail",
        description:
          "Take on the rugged beauty of the Scottish Highlands with a gravel biking adventure that offers a unique blend of challenge and scenic splendor. This trail leads you through the wild landscapes of the Highlands, featuring demanding climbs, thrilling descents, and unparalleled views of the natural surroundings. The gravel paths provide an added element of adventure, making this route ideal for cyclists seeking to explore off the beaten path.\n\nThe Scottish Highlands Gravel Trail is a testament to the untamed beauty of Scotland, offering riders a chance to experience the solitude and majesty of the Highlands. The varied terrain tests your skills and endurance, while the stunning vistas provide a rewarding backdrop for your efforts. Whether you're an experienced gravel rider or looking to try something new, this trail promises an unforgettable journey through one of the most breathtaking regions in the UK.",
        distance: 35.0,
        elevationGain: 800,
        minimumGrade: 4,
        maximumGrade: 9,
        averageGrade: 6,
        timeToComplete: 18000,
        difficultyLevel: "Moderate",
        activityType: "Bike",
        routeType: "Hilly",
        climbCategory: "Four",
        photos: [
          "https://images.unsplash.com/photo-1675213442374-c9b44459e798?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3JhdmVsJTIwY3ljbGluZ3xlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1675213442164-a7efb3e32c5f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Z3JhdmVsJTIwY3ljbGluZ3xlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1675213442182-24e1c1671387?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGdyYXZlbCUyMGN5Y2xpbmd8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1675213442178-80213b50184b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGdyYXZlbCUyMGN5Y2xpbmd8ZW58MHx8MHx8fDI%3D",
        ],
        tags: ["Highlands", "gravel", "adventure"],
        address: {
          city: "Fort William",
          state: "Highland",
          country: "UK",
        },
        startCoordinate: {
          latitude: 56.819817,
          longitude: -5.105218,
        },
        endCoordinate: {
          latitude: 56.827185,
          longitude: -5.092486,
        },
      },
      {
        name: "Offenburg to Gengenbach Vineyard Trail",
        description:
          "Savor the natural beauty and rich wine culture of the Baden-Württemberg region with a scenic bike ride from Offenburg to Gengenbach. This trail meanders through the picturesque vineyards that blanket the hillsides, offering stunning views of the landscape and a taste of the local viticulture. The ride to Gengenbach is as enchanting as the destination itself, with the trail passing through lush vineyards, idyllic countryside, and historic villages that epitomize the charm of the region.\n\nThe Offenburg to Gengenbach Vineyard Trail is a delightful journey for anyone interested in wine, nature, and cycling. Along the way, there are ample opportunities to stop at local wineries for tastings and to explore the historic town of Gengenbach, known for its well-preserved medieval architecture and welcoming atmosphere. This bike tour combines the joy of cycling with the pleasures of wine tasting and cultural exploration, making it a perfect outing for enthusiasts of all three.",
        distance: 15,
        elevationGain: 350,
        minimumGrade: 2,
        maximumGrade: 8,
        averageGrade: 5,
        timeToComplete: 6000,
        difficultyLevel: "Hard",
        activityType: "Bike",
        routeType: "Hilly",
        climbCategory: "Three",
        photos: [],
        tags: ["vineyards", "scenic", "Offenburg", "Gengenbach"],
        address: {
          city: "Offenburg",
          state: "Baden-Württemberg",
          country: "Germany",
        },
        startCoordinate: {
          latitude: 48.4729,
          longitude: 7.9407,
        },
        endCoordinate: {
          latitude: 48.4095,
          longitude: 8.0129,
        },
      },
      {
        name: "Black Forest North Escape",
        description:
          "Embark on a captivating journey through the northern Black Forest, where the allure of nature meets the thrill of the ride. This challenging route offers cyclists the chance to experience the diverse landscapes of the region, from dense forests to panoramic views that stretch across the horizon. The ascent through the Black Forest is both demanding and rewarding, with each pedal stroke bringing you closer to the heart of this legendary woodland.\n\nThe Black Forest North Escape is a journey that blends physical challenge with the tranquility of nature. As you navigate the winding paths and steep climbs, the beauty of the Black Forest unfolds before you, offering a serene escape from the everyday. This ride is an adventure for those who seek to push their limits while immersing themselves in the natural splendor of one of Germany's most famous regions.",
        distance: 22,
        elevationGain: 700,
        minimumGrade: 3,
        maximumGrade: 12,
        averageGrade: 6,
        timeToComplete: 9000,
        difficultyLevel: "Very Hard",
        activityType: "Bike",
        routeType: "Hilly",
        climbCategory: "Two",
        photos: [
          "https://images.unsplash.com/photo-1687860910109-fb6c7a6c8a6b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y3ljbGluZyUyMG1vdW50YWluc3xlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1699389359830-7b49eac067ad?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGN5Y2xpbmclMjBtb3VudGFpbnN8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1699389360830-30c43a34270c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGN5Y2xpbmclMjBtb3VudGFpbnN8ZW58MHx8MHx8fDI%3D",
        ],
        tags: ["Black Forest", "mountain", "Offenburg"],
        address: {
          city: "Offenburg",
          state: "Baden-Württemberg",
          country: "Germany",
        },
        startCoordinate: {
          latitude: 48.473,
          longitude: 7.944,
        },
        endCoordinate: {
          latitude: 48.5313,
          longitude: 8.0523,
        },
      },
      {
        name: "Freiburg to Schauinsland Summit",
        description:
          "Ascend from the vibrant city of Freiburg to the breathtaking summit of Schauinsland on this exhilarating bike ride. The route challenges you with steep climbs through the Black Forest, revealing stunning views and the sheer beauty of nature as you ascend. The ride to Schauinsland Summit is a rewarding experience, offering a mix of urban scenery, dense forests, and panoramic views from the top.\n\nReaching the summit of Schauinsland by bike is an achievement that offers not only a sense of accomplishment but also an opportunity to enjoy the tranquility and beauty of the surrounding landscape. The descent back to Freiburg provides a thrilling ride, with the wind in your hair and the city's welcoming sights ahead. This ride is a must-do for cycling enthusiasts seeking to explore the natural wonders around Freiburg and experience the exhilaration of a mountain ascent.",
        distance: 18,
        elevationGain: 800,
        minimumGrade: 5,
        maximumGrade: 10,
        averageGrade: 7,
        timeToComplete: 8000,
        difficultyLevel: "Hard",
        activityType: "Bike",
        routeType: "Hilly",
        climbCategory: "One",
        photos: [
          "https://images.unsplash.com/photo-1699389359817-6d17d0880c2f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGN5Y2xpbmclMjBtb3VudGFpbnN8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1568659533134-8426fe834bad?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2NoYXVpbnNsYW5kfGVufDB8fDB8fHwy",
          "https://images.unsplash.com/photo-1534787238916-9ba6764efd4f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U2NoYXVpbnNsYW5kJTIwY3ljbGluZ3xlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1567939696026-529d1b096303?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjd8fGN5Y2xpbmclMjBtb3VudGFpbnN8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1699389359829-802bf03ca896?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGN5Y2xpbmclMjBtb3VudGFpbnN8ZW58MHx8MHx8fDI%3D",
        ],
        tags: ["Freiburg", "Schauinsland", "summit"],
        address: {
          city: "Freiburg",
          state: "Baden-Württemberg",
          country: "Germany",
        },
        startCoordinate: {
          latitude: 47.9959,
          longitude: 7.8494,
        },
        endCoordinate: {
          latitude: 47.9105,
          longitude: 7.8985,
        },
      },
      {
        name: "Kandel Mountain Challenge",
        description:
          "Take on the ultimate cycling challenge with a ride to the peak of Kandel Mountain. This route promises steep grades and demanding climbs, but the rewards are the spectacular views from the summit and the thrill of conquering one of the Black Forest's most formidable peaks. The ascent through dense forests and along scenic overlooks offers a test of both skill and endurance, with the landscape providing a dramatic backdrop to your journey.\n\nThe Kandel Mountain Challenge is a ride that appeals to the adventurous spirit of cyclists looking for a significant test of their abilities. The descent provides a fast and exhilarating return trip, offering a sense of accomplishment as you look back on the heights you've achieved. This challenging ride is a must for anyone seeking to push their limits and experience the best of the Black Forest's rugged terrain.",
        distance: 20,
        elevationGain: 950,
        minimumGrade: 6,
        maximumGrade: 15,
        averageGrade: 8,
        timeToComplete: 10000,
        difficultyLevel: "Extremely Hard",
        activityType: "Bike",
        routeType: "Hilly",
        climbCategory: "Hors Categorie (HC)",
        photos: [
          "https://images.unsplash.com/photo-1699389359912-09ca1583bfde?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fGN5Y2xpbmclMjBtb3VudGFpbnN8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1647394166281-713a8d923728?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDl8fGN5Y2xpbmclMjBtb3VudGFpbnN8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1615845522103-82f98cd2a9de?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzF8fGN5Y2xpbmclMjBtb3VudGFpbnN8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1605613086827-38d562926d77?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzN8fGN5Y2xpbmclMjBtb3VudGFpbnN8ZW58MHx8MHx8fDI%3D",
        ],
        tags: ["Kandel", "mountain", "Freiburg"],
        address: {
          city: "Freiburg",
          state: "Baden-Württemberg",
          country: "Germany",
        },
        startCoordinate: {
          latitude: 48.0059,
          longitude: 7.849,
        },
        endCoordinate: {
          latitude: 48.0737,
          longitude: 8.0154,
        },
      },
      {
        name: "Heidelberg Philosophers' Way",
        description:
          "Experience the historic charm and natural beauty of Heidelberg by cycling the Philosophers' Way. This path offers stunning views of Heidelberg Castle, the Old Bridge, and the Neckar River, making it a popular route for both locals and tourists. The ride combines steep climbs with rewarding vistas, providing a unique perspective on the city's scenic landscapes and architectural marvels.\n\nThe Philosophers' Way is more than just a cycling route; it's a journey through history and nature. Along the way, you'll find numerous spots to pause and reflect, just as the philosophers once did, making it a contemplative as well as a physical challenge. This bike path is a must-visit for anyone looking to explore Heidelberg's rich cultural heritage and enjoy its breathtaking natural surroundings.",
        distance: 10,
        elevationGain: 300,
        minimumGrade: 4,
        maximumGrade: 9,
        averageGrade: 5,
        timeToComplete: 3600,
        difficultyLevel: "Moderate",
        activityType: "Bike",
        routeType: "Hilly",
        climbCategory: "Four",
        photos: [
          "https://images.unsplash.com/photo-1631276893368-554b60393efb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGN5Y2xpbmd8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1606224547099-b15c94ca5ef2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGN5Y2xpbmd8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1605050825221-66a810cb6d36?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTh8fGN5Y2xpbmd8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1601279994918-13b0b9e88906?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fGN5Y2xpbmd8ZW58MHx8MHx8fDI%3D",
        ],
        tags: ["Heidelberg", "Philosophers' Way", "scenic"],
        address: {
          city: "Heidelberg",
          state: "Baden-Württemberg",
          country: "Germany",
        },
        startCoordinate: {
          latitude: 49.4101,
          longitude: 8.7156,
        },
        endCoordinate: {
          latitude: 49.4162,
          longitude: 8.722,
        },
      },
      {
        name: "Central Park Morning Run",
        description:
          "Begin your day with a refreshing run through Central Park, the green heart of New York City. This morning run is an escape into nature amidst the urban landscape, offering serene paths, lush greenery, and tranquil waters. As you jog through the park, you'll pass iconic sights such as Bethesda Terrace, the Central Park Zoo, and The Mall, all while enjoying the peaceful ambiance of the early morning.\n\nThe Central Park Morning Run is not only a physical activity but also a moment of peace before the city wakes up. The paths are less crowded, the air is fresher, and the sound of birdsong replaces the usual urban noise. Whether you're a local looking for a daily exercise routine or a visitor seeking to experience Central Park's beauty, this run provides a perfect start to your day, combining health, tranquility, and the unique charm of New York City.",
        distance: 5.0,
        elevationGain: 50,
        minimumGrade: 0,
        maximumGrade: 4,
        averageGrade: 1,
        timeToComplete: 1800,
        difficultyLevel: "Easy",
        activityType: "Run",
        routeType: "Flat",
        photos: [
          "https://images.unsplash.com/photo-1572536917952-ff353a16fa64?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGNlbnRyYWwlMjBwYXJrfGVufDB8fDB8fHwy",
          "https://images.unsplash.com/photo-1575372587186-5012f8886b4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2VudHJhbCUyMHBhcmt8ZW58MHx8MHx8fDI=",
          "https://images.unsplash.com/photo-1623593419606-7f9c8c22d736?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2VudHJhbCUyMHBhcmt8ZW58MHx8MHx8fDI=",
          "https://images.unsplash.com/photo-1560806925-36a1f0240279?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGNlbnRyYWwlMjBwYXJrfGVufDB8fDB8fHwy",
        ],
        tags: ["morning", "park", "New York"],
        address: {
          city: "New York",
          state: "NY",
          country: "USA",
        },
        startCoordinate: {
          latitude: 40.785091,
          longitude: -73.968285,
        },

        endCoordinate: {
          latitude: 40.796787,
          longitude: -73.949232,
        },
      },
      {
        name: "Golden Gate Bridge Run",
        description:
          "Experience the iconic Golden Gate Bridge like never before with a morning run that captures the essence of San Francisco. This route takes you along the bridge's pedestrian pathways, offering spectacular views of the city skyline, Alcatraz Island, and the Marin Headlands. The cool morning air and the gentle mist from the bay create a refreshing environment for runners, making it a memorable way to start the day.\n\nRunning across the Golden Gate Bridge provides not only a great workout but also a moment of awe as you take in the engineering marvel and natural beauty that surround you. The sense of accomplishment when reaching the other side is unparalleled, and the return journey offers a different perspective on the bridge and the bay. This run is a must-do for fitness enthusiasts and sightseers alike, providing an up-close experience of one of the world's most famous landmarks.",
        distance: 3.5,
        elevationGain: 100,
        minimumGrade: 1,
        maximumGrade: 6,
        averageGrade: 2,
        timeToComplete: 1500,
        difficultyLevel: "Moderate",
        activityType: "Run",
        routeType: "Rolling",
        photos: [
          "https://images.unsplash.com/photo-1516473344662-e3a32406ecad?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z29sZGVuJTIwZ2F0ZXxlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1610476905149-ac7d552b46be?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Z29sZGVuJTIwZ2F0ZXxlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1598197904775-6de974571795?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Z29sZGVuJTIwZ2F0ZXxlbnwwfHwwfHx8Mg%3D%3D",
        ],
        tags: ["bridge", "San Francisco", "morning"],
        address: {
          city: "San Francisco",
          state: "CA",
          country: "USA",
        },
        startCoordinate: {
          latitude: 37.8199286,
          longitude: -122.4782551,
        },
        endCoordinate: {
          latitude: 37.802394,
          longitude: -122.455516,
        },
      },
      {
        name: "Trail Run Through Griffith Park",
        description:
          "Griffith Park offers a unique trail running experience that combines urban accessibility with the ruggedness of natural terrain. This extensive network of trails provides runners with challenging inclines, diverse landscapes, and panoramic views of Los Angeles and the Hollywood Sign. As you navigate through the park, you'll encounter a variety of trails, each offering a different experience, from shaded woodland paths to open vistas atop the park's many peaks.\n\nThe trail run through Griffith Park is an excellent way to connect with nature without leaving the city. The park's vastness allows for a sense of solitude and discovery, with each run offering new paths to explore. Whether you're training for a trail race or simply looking for a way to add variety to your running routine, Griffith Park's trails offer an invigorating and scenic workout that caters to runners of all levels.",
        distance: 10.0,
        elevationGain: 500,
        minimumGrade: 0,
        maximumGrade: 15,
        averageGrade: 5,
        timeToComplete: 3600,
        difficultyLevel: "Hard",
        activityType: "Run",
        routeType: "Hilly",
        photos: [
          "https://images.unsplash.com/photo-1617247061380-e6b3a14a59cf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fEdyaWZmaXRoJTIwUGFya3xlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1588123066808-77f5ed279aee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8R3JpZmZpdGglMjBQYXJrfGVufDB8fDB8fHwy",
        ],
        tags: ["trail", "Los Angeles", "nature"],
        address: {
          city: "Los Angeles",
          state: "CA",
          country: "USA",
        },
        startCoordinate: {
          latitude: 34.136554,
          longitude: -118.2942,
        },
        endCoordinate: {
          latitude: 34.132334,
          longitude: -118.280542,
        },
      },
      {
        name: "Hyde Park Sunrise Run",
        description:
          "Embrace the beauty of London at dawn with a sunrise run around Hyde Park. This expansive park offers a tranquil setting for morning runs, with well-maintained paths winding through open meadows, serene lakes, and shaded woodlands. As the city sleeps, runners can enjoy the peaceful ambiance and the first light of day reflecting off the Serpentine Lake, creating a magical start to the day.\n\nHyde Park's central location makes it an accessible running destination for both locals and visitors. The park's vast open spaces and scenic beauty provide a refreshing contrast to the urban environment, making it an ideal place for a morning run. Whether you're seeking solitude, training for an event, or simply wanting to start your day on a positive note, a sunrise run in Hyde Park offers a memorable experience amidst one of London's most iconic green spaces.",
        distance: 4.0,
        elevationGain: 40,
        minimumGrade: 0,
        maximumGrade: 3,
        averageGrade: 1,
        timeToComplete: 2000,
        difficultyLevel: "Easy",
        activityType: "Run",
        routeType: "Flat",
        photos: [
          "https://images.unsplash.com/photo-1560706834-c8b400d29d37?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aHlkZSUyMFBhcmt8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1574361435965-10615b228eef?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aHlkZSUyMFBhcmt8ZW58MHx8MHx8fDI%3D",
        ],
        tags: ["park", "London", "sunrise"],
        address: {
          city: "London",
          state: "London",
          country: "UK",
        },
        startCoordinate: {
          latitude: 51.507268,
          longitude: -0.16573,
        },
        endCoordinate: {
          latitude: 51.512488,
          longitude: -0.175607,
        },
      },
      {
        name: "Vancouver Seawall Run",
        description:
          "The Vancouver Seawall Run offers a breathtaking journey along one of the city's most picturesque landmarks. This popular route skirts the water's edge, providing stunning views of the ocean, mountains, and skyline. The gentle sea breeze and rhythmic sound of the waves create a refreshing backdrop for runners of all levels. The path stretches around Stanley Park, offering a diverse landscape that includes beaches, forests, and urban vistas.\n\nRunning along the Seawall is an invigorating way to experience Vancouver's natural beauty and vibrant culture. The flat, well-maintained path is ideal for a leisurely jog or a more vigorous run, with plenty of opportunities to stop and enjoy the scenery. Whether you're a local resident looking for a daily exercise route or a visitor seeking to explore the city's outdoor attractions, the Vancouver Seawall Run provides an unforgettable experience that highlights the best of what Vancouver has to offer.",
        distance: 9.0,
        elevationGain: 20,
        minimumGrade: 0,
        maximumGrade: 2,
        averageGrade: 1,
        timeToComplete: 3300,
        difficultyLevel: "Moderate",
        activityType: "Run",
        routeType: "Flat",
        photos: [
          "https://images.unsplash.com/photo-1639074379093-c13d4af36e7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8VmFuY291dmVyJTIwU2Vhd2FsbHxlbnwwfHwwfHx8Mg%3D%3D",
          "https://images.unsplash.com/photo-1611674929309-30a2c9be2f2b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fFZhbmNvdXZlciUyMFNlYXdhbGx8ZW58MHx8MHx8fDI%3D",
          "https://images.unsplash.com/photo-1698889245446-f68aa6e90748?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fFZhbmNvdXZlciUyMFNlYXdhbGx8ZW58MHx8MHx8fDI%3D",
        ],
        tags: ["seawall", "Vancouver", "scenic"],
        address: {
          city: "Vancouver",
          state: "BC",
          country: "Canada",
        },
        startCoordinate: {
          latitude: 49.289418,
          longitude: -123.142676,
        },
        endCoordinate: {
          latitude: 49.282729,
          longitude: -123.120738,
        },
      },
    ];
    // Validate and prepare all activities data before insertion
    const preparedActivities = activitiesData.map((activityInput) => {
      const validationResult = activityValidationSchema.validate(activityInput);
      if (validationResult.error) {
        throw new Error(validationResult.error.message); // This will exit the loop and catch block will catch it
      }

      return {
        ...validationResult.value,
        slug: slugify(validationResult.value.name, {
          lower: true,
          strict: true,
        }),
        isCreatedByAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    // Bulk insert the prepared activities
    await ActivityModel.insertMany(preparedActivities);

    console.log(
      `${preparedActivities.length} activities created successfully.`
    );
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabaseWithMultipleActivities().then(() => mongoose.disconnect());
