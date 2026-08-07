# Image Assets Guide

Save every image below into this folder: `frontend/public/images/`
All images used in the code so far are royalty-free. Download them from
Unsplash, Pexels, or Pixabay using the search keywords given, save with
the **exact file name** listed, and they'll work immediately since the
code already references these paths.

| File name             | Search keywords                     | Suggested source | Used on            |
|------------------------|--------------------------------------|-------------------|---------------------|
| hero-banner.jpg        | "tea garden hills sunrise"          | Unsplash          | Homepage hero        |
| ratargul.jpg           | "swamp forest boat Bangladesh"      | Pexels/Unsplash   | Featured destinations|
| jaflong.jpg            | "river hills stones Bangladesh"     | Pexels/Unsplash   | Featured destinations|
| lalakhal.jpg           | "turquoise river boat"              | Unsplash          | Featured destinations|
| bichanakandi.jpg       | "stone quarry stream hills"         | Pexels            | Part 2 destinations  |
| madhabkunda.jpg        | "waterfall forest"                  | Unsplash          | Part 2 destinations  |
| tea-garden.jpg         | "tea plantation green hills"        | Unsplash          | Homepage about       |
| guide1.jpg             | "male tour guide portrait"          | Pexels            | Part 2 guides        |
| guide2.jpg             | "female tour guide portrait"        | Pexels            | Part 2 guides        |
| private-car.jpg        | "white sedan car"                   | Pexels            | Part 2 vehicles      |
| microbus.jpg           | "minivan white"                     | Pexels            | Part 2 vehicles      |
| hiace.jpg              | "toyota hiace van"                  | Pexels            | Part 2 vehicles      |
| tourist-bus.jpg        | "tourist coach bus"                 | Pexels            | Part 2 vehicles      |
| default-avatar.png     | "blank profile avatar icon"         | Pixabay           | Guide/driver profile |
| logo.png               | (design your own, or use text logo) | -                 | Navbar               |

### How to download and import
1. Go to unsplash.com, pexels.com, or pixabay.com.
2. Search using the keywords above.
3. Download the **free** version (no login required on Pexels/Pixabay,
   Unsplash needs a free account to download).
4. Rename the downloaded file to match the **File name** column exactly.
5. Move it into `frontend/public/images/`.
6. The code already imports images using paths like
   `/images/hero-banner.jpg` - no code changes needed once
   the file exists at that path.

> Until you add real images, the site will show broken image icons -
> this is expected and does not mean the code is wrong.
