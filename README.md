# carrot-game-show

This is a gamehow engine to show things on a screen for hosting various types of gameshows.

This is old stuff I haven't worked with in a long time. It used to work, but then I started adding networking, and now it doesn't. Maybe someday soon?
I mean, it sorta works, just not super well and it isn't really tested yet.

---
# Style Guide
This section describes code style things. This is specific to this repo

## Overview
1. Curly brackets share lines
1. Indent with tabs, not spaces
1. Plenty of comments
1. Condense code
1. Variables have descriptive names
1. File names are lower case unless they are for a class
1. Use semicolons

## Details

### Curly brackets share lines
Put the opening curly brackets for blocks on the same line as the statement that opens the block

    // Good
    for(let i = 0; i < 7; i++) {
      console.log("Hi %d\n", i);
    }

    // Bad
    for(let i = 0; i < 7; i++)
    {
      console.log("Hi %d\n", i);
    }

### Indent with tabs, not spaces
Use a tab character to indent code. If this is not possible, use 4 spaces.

### Plenty of comments
Use plenty of comments in your code so that everyone knows what it does. Comments should be placed at a minimum

1. Before function definitions in source files. The exact format isn't important, as long as all relevant details are there.

        /* getSkittles()
         * Gets how many skittles a player has.
         * May not work if the player is underwater
         * color - the Color of the skittles to count. Counts all colors if the color is black.
         */
        function getSkittles(color) { ... }

1. At the top of every file stating the filename, what the file does, and the primary author(s) of the file

        /* Player.js
         *
         * Main code for the Player
         *
         * Author: Bob the Builder
         */

1. Anywhere else you think they are needed. This could be near the top of the header files describing data formats, general usage, or limitations.

### Condense code
Condense blocks of code any time it makes the overall code easier to read. This might be if there is only a single function call in a block. Also, use blank lines sparingly, but do use them where they improve readability, such as before function definitions or between chunks of related code. In general, keep code neat but readable.

    switch(color) {
    case GREEN: { console.log("Grass is green!"); } break;
    case BLUE: { swim(); }
    case PINK: { startFire(color); }
    case RED: {
      for(let i = 0; i < numCows; i++) {
        if(i % 2 == 0) { cows[i].paint(RED); }
      }
    } break;
    default: {
      for(int i = 0; i < numCows; i++) {
        cows[i].paint(color);
      }
    } break;
    }
### Variables have descriptive names
* Variables should have useful names. They shouldn't be too long, (ex: theNumberOfPeopleWhoAtePie is too long)
* Variable names should be named in camel case with no underscores. (ex: skittleCount)
* Constant names should be in all caps with underscores as needed to separate words (ex: MAX_SKITTLES)
* Single letter names are allowed as long as they have a common usage and/or are used in a small scope (ex: i,j,x,y,c are usually fine)
* Variable names must be unique in their scope. Thins includes different capitalization and punctuation, (ex: if you have numCows, you should not also have NumCows, num_cows, NUM_COWS, or _numCows). The only exception is that an instance of a class may share the name of a class (but in camel case rather than pascal case) if it is the only instance of that class in that scope.

### File names are lower case unless they are for a class
Files should be given detailed names, ending in .js for JavaScript files, .html for HTML files, and .css for CSS files. If the file is not primarily for a class, it should be named in all lower case.

### Use semicolons
Even though JavaScript doesn't require them, please use semicolons at the end of lines.

---
# GitHub work flow

The general workflow for a bug or feature is:
1. Open an issue
1. Make a new branch
1. Make the changes
1. Create a Pull Request

### Issues
In general, if you are working on something, it should be associated with a GitHub issue. If the task is small, this may be skipped.

Feature requests and bugs both get associated issues.

* In general, features will start with an issue tagged with the `enhancement` tag.
* In general, buts will be documented with an issue tagged with the `bug` tag.
* You can make issues tagged with `documentation`, but they will have a very low priority.

Keep issue titles concise, and include details in the description.

Additionally, I encourage you to add a tasklist to issues. This can be done by typing into the description
    - [x] Task 1 that is done
    - [ ] Task 2 that is not done

### Branches
When you are ready to work on something, make a new branch. If this has an associated issue, create the branch from the issue. If the issue title is large, you may need to pick a shorter branch name

### Changes
Once you have started a branch, make all your changes in that branch. Remember to commit and push often, by working in your own branch you won't break other people's work. Also remember to thoroughly test your work before creating a pull request.

Commit messages should start with a brief (<=72 characters) description of what was done. This should include things like the location if it is ambiguous and what you did. The second line should be left blank (if you can), then any further lines can contain more information if you feel the need.

If you use the GitHub editor, commit messages consist of a title and a body. The title contains the brief description, and the body contains details. GitHub will not include the blank line, but do not worry about it here.

### Pull Requests
Once your work on the issue is done and the branch is ready to be merged back in, create a Pull Request on GitHub. Ben will then take a look at your work, merge it into master, and mark the issue resolved.
