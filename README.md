# Atelier Meridian Animated Website

## Project Summary
This project is a premium interior design landing page built iteratively from user prompts.  
It includes:
- a cinematic hero with background video (`interior_design.mp4`)
- sticky responsive navigation with active section tracking
- a scroll-driven exploded-view storytelling section using video scrubbing (`interior_design_exploding.mp4`)
- performance and readability optimizations for smoother scrolling and clearer text overlays

## Tech Stack
- HTML (`index.html`)
- CSS (`styles.css`)
- Vanilla JavaScript (`script.js`)
- Local static server (`python -m http.server`)

## Exact Prompts Used (In Order)
1. `use this skill https://github.com/Leonxlnx/taste-skill.git to design a high end interior design`
2. `hey, I want you to take interior_design.mp4 and then make it the backgorund image of our hero header. Then center the hero header so that it looks really clean. Then apply some sort of inward masking gradient so that the animation background doesn't interfere with the background of the website`
3. `now run this project`
4. `Navigation Issues
No sticky header — When a user scrolls down, the navigation disappears. The nav should stick to the top so users can always jump between sections without scrolling back up.

No active section indicator — As the user scrolls, the navbar should highlight which section is currently in view (e.g., underline "Projects" when in the projects section).

No mobile hamburger menu — At narrow viewport widths, the 3 nav links will break. You need a collapsible mobile menu.`
5. `Hero Section
CTA buttons lack visual hierarchy — "Start a private brief" (green) and "View portfolio" (white outline) are roughly equal in weight. Since "Start a private brief" is the primary conversion action, make it significantly more prominent and make "View portfolio" a tertiary button (text-only or subtle ghost style).

No scroll indicator — There's nothing hinting to the user that there's more content below. A subtle scroll-down chevron or animated arrow would help.`
6. `great! I have interior_design_exploding.mp4. I want you to take  that and then create a scroll animation immerdiately underneath the hero header. As i scroll through, we should rife through two or three sections of text that expose our design skills, and then it should also show the exploding view frame by frame as we go`
7. `Did you use the video which I have given to you? If the answer is yes, it's not executed properly into the website, check it.`
8. `hey, there are two problems: 1.the fuzzy gradient is not strong enough, and so we see a bunch of dividing colors between the top and then the bottom. Make sure to make the gradient a little bit stronger n the top and the bottom. 2)it's really laggy, so just fix up the lag.make it load significantly faster`
9. `still have alittle bit of lag. also add some sort of overlay to the text because right now it's very difficult to see and just kind of collides with the animation`
10. `create a readme file, in the file there has to be  all the steps which we have use to build this project. Include the prompt which i have given to you`

## Build Timeline / Steps Implemented
1. Installed and applied the requested design skill from GitHub (`taste-skill`).
2. Created the initial premium landing structure and styling:
   - `index.html`
   - `styles.css`
   - `script.js`
3. Added hero background video support:
   - replaced static hero visuals with `interior_design.mp4`
   - centered hero content
   - added inward masking gradient to blend video into the page background
4. Added sticky navigation features:
   - sticky top navigation bar
   - active section indicator on scroll
   - mobile hamburger menu with open/close behavior
5. Improved hero conversion UX:
   - stronger primary CTA (`Start a private brief`)
   - tertiary style for `View portfolio`
   - animated scroll indicator
6. Added exploded-view storytelling section directly below hero:
   - new section with 3 narrative text phases
   - sticky visual panel using exploding video
   - scroll-scrub logic to update video frame-by-frame with scroll progress
7. Fixed exploding video reliability:
   - aligned filename/path to `interior_design_exploding.mp4`
   - improved metadata/load handling so scrub starts reliably
8. Improved visual blending and performance:
   - stronger top/bottom gradient mask in exploded section
   - reduced scrub overhead (throttling, offscreen skip, controlled seeking)
9. Added stronger text overlay/readability layer:
   - glass/overlay treatment behind exploding-section text
   - improved text contrast against moving background
10. Final lag optimization pass:
   - quantized scrubbing updates
   - reduced update frequency for smoother scrolling on lower-end devices

## Final File Structure
- `index.html`
- `styles.css`
- `script.js`
- `interior_design.mp4`
- `interior_design_exploding.mp4`

#
