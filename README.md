## Blossom Scene - Animated Artwork

### Instructions on how to interact with the work

Since the method used for the animation of this artwork is *Time-Based* Manipulation of its elements there is no element for user interaction with the drawing.

All of the events are triggered one by one and automatically after particular values of frame counts are reached.

### Details of my individual approach to animating the group code

The method used for the manipulation of the original Group Code is *Time-Based* Manipulation of its elements.

In order to ensure the outputs of our Individual work in the Group will differ enought we all pitched our ideas of how to implement the assigned methods.

Further developing our group interpretation of the orignal artwork of Emily's Kngwarreye the theme choosen for my individual alternation is **"Blossom Scene"**.

>“Her artworks embrace the whole life story of the Dreamtime, seeds, flowers, wind, sand and everything”.
###### (2020, Kate Owen Gallery)

Working with the time-based methods I am intending to alter the shape of the existing flowers such that they change over time, growing and blossoming - just as in the *Dreamtime Stories* that have been Emily's Kngwarreye's inspiration for the original *'Ntange II (Grass)'* piece.


>“The Dreaming explains how things came to be – why a rock is in a certain place or a particular shape, why the echidna has spikes, why the moon returns full every month, and how kangaroos got their tails”
###### (2021, Aboriginal Contemporary)

Through my artwork I will firstly explain how the flowers came to be.

> “The Dreaming is constantly evolving to explain events and changes today”
###### (2021, Aboriginal Contemporary)

Further drawing from my deeper understanding of the *Dreaming* I want to visualize a full life cycle of the flowers.

#### Elements of the Artwork that will be manipulated in order to achieve the desired visual effect:
- **number of petals** - increased over time to show the flower growing and developing.
- **shape of the petals** - curvature will be altered over time to show the flower growing, developing and changing.
- **size of the seeds** - increased over time to show the flower blooming.
- **position of the seeds** - 'disattached' from the flower once it's life cycle comes to an end.
- **size of the petals** - abruptly decreased once the flower's life cycle comes to an end.
- **background dots** - number of the dots floating in the background will be firstly increased frame by frame to create an effect of filling the canvas out with more and more blooming elements. Once the scene comes to an end the size will be decreased hinting the whole process will start again soon.

#### Technical Explanation

I will control the order of the events with a use of *if-statements* dependent on the frame count. I am intending to use the `FrameCount` value to increase and decrease the values of the particular properties of the elements in the artwork.

For smoother animations and transitions I am intending to apply `lerp()` functions. In order to make my piece visually different from the artworks of my group members I will add some additional elements such as extra leaves and potentiall stalks for the flowers.

##### significant changes to the group code:

- In order to manipulate the number and size of the background dots the `drawDots()` function will be moved to the main `Draw()` function and the `InitializeDots()` removed.
- Some of the values and properties for the elements will be added or removed, the generation of randomness for the shapes will be modified in some cases.