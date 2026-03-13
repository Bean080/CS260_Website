# CS 260 Notes

[My startup - Simon](https://simon.cs260.click)

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## AWS

My IP address is: 54.81.96.130
Launching my AMI I initially put it on a private subnet. Even though it had a public IP address and the security group was right, I wasn't able to connect to it.

>Potential api: face-api.js

## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md).

## HTML

This was easy. I added temporary links for now, since I will be doing that automatically later. Forms were a bit tricky and I think I will need to do more work to extract the data properly. I also need to implement css to help with alignment.

## CSS

I spent forever trying to get everything lined up nice. I ran into a few issues with the shading on the screen.

I am pretty happy with the font i found and the buttons I made ended up looking very nice.

```html
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand">
            <img src="logo.svg" width="30" height="30" class="d-inline-block align-top" alt="" />
            Calmer
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" href="play.html">Play</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="about.html">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="index.html">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
```

I also used SVG to make the icon and logo for the app. This turned out to be a piece of cake.

```html
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#0066aa" rx="10" ry="10" />
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-size="72" font-family="Arial" fill="white">C</text>
</svg>
```

## React Part 1: Routing

This part required significant rewriting of previous html and css. I still think that the css needs more fine tuning on a lter date, but I needed to get this deliverable finished. It does look nice how it ended up, but I will need to change some things around since a nav bar doesn't really work with the website concept that I have.

## React Part 2: Reactivity

I spent a crazy amount of time on this section but got it working suoer well. I am going to put the steps to get started here so that the TAs can see them. I had a lot of fun and headaches getting the mechanics of the game itself to work. Local memory is a bit troublesome when it comes to people having left over data from previous visits.

1. open the webpage
2. go to accounts
3. create an account
4. enter a code and hit host
5. you can either go add players with the test buttons or wait for them to join
6. click play when you have a few players
7. take photos and confirm them as the target to eliminate players. (they also eliminate eachother)
8. Ending the game early will only display the eliminated players, so you can do that or just take a few photos to do it automatically (that will look better)

## React Part 2: Reactivity

I really like the the use of endpoints. It definately slowed my website down quite a bit. Being data to persist on the front end is a bit tricky and I don't think i have the most eligante of solutions. Deploying to the server was an absolute headache. The Gemini Api is super cool, but I had to add a smaller one to meet the requirements of calling it from the front end.
