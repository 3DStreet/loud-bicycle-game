
const loseMessages = [
    { 
        header: "You came out of nowhere!",
        content: ". Next time stay in this universe, no straying in and out of the multiverse."
      },
      {
        header: "I had the right of way",
        content: ", next time steer clear of their royal highness, the baby princess of the parkway."
      },
      {
        header: "You were in my blind spot",
        content: ". Please next time provide your psychic premonition hotline for the blind people driving."
      },
      {
        header: "You were in my blind spot",
        content: ", remember it's a good idea to give the blind people driving extra space to careen."
      },
      {
        header: "I couldn't see you",
        content: ". Next time don't use your invisibility cloak."
      },
      {
        header: "I couldn't see you coming",
        content: ", next time wear your suit of sparkling laser disco balls."
      },
      {
        header: "Why weren't you on the sidewalk",
        content: ", next time please ride on the sidewalk, cars will use the bike lane and Medium M4 Sherman Tanks will use the road."
      },
      {
        header: "The sun was in my eyes",
        content: ". Next time don't ride until there is a solar eclipse and it reaches totality."
      },
      {
        header: "I was on TickTock",
        content: ". Next time send a relatable TickTock to the people crashing into you."
      },
      {
        header: "I didn't expect a person to be biking",
        content: ", try sending a memo to every person driving 24 hours before your next ride."
      },
      {
        header: "I just didn't see you",
        content: ". You should really wear your suit of sparkling laser disco balls every single day."
      },
      {
        header: "If you want to be treated like a car ...",
        content: " .... well you have to get into car crashes too."
      },
      {
        header: "Were you wearing a helmet?",
        content: " but not to worry, because you were wearing a helmet everything is totally fine."
      },
  ];
  
const winMessages = [
    { 
      header: "Win Message 1",
      content: "Congratulations, you won!"
    },
    {
      header: "Win Message 2",
      content: "Fantastic job!"
    },
    // ... add more objects for all win messages
  ];
  
const advertisements = [
    { 
      header: "Get Loud",
      content: 'Thanks to our sponsors Loud Bicycle for keeping people safe on the road with the Loud Mini bike horn that sounds like a car horn. <a href="https://loud-bicycle-store.myshopify.com/cart/32290221654067:1,10359316551:1">Get yours here</a>'
    },
    {
      header: "Buy the Loud Mini",
      content: 'Pssst... this game is a weird advertising ploy. Please go here and get the horn now <a href="https://loud-bicycle-store.myshopify.com/cart/32290221654067:1,10359316551:1">Buy now</a>.'
    },
    // ... add more objects for all win messages
  ];
  

  
// Function to select and format a random message
export function getRandomMessage(messageType, hitCounter, killVehicle) {
    let messages;

    // Determine which message array to use based on messageType
    switch (messageType) {
    //   case 'runOver':
    //     messages = runOverMessages;
    //     break;
      case 'fail':
        messages = loseMessages;
        break;
      // Add cases for other message types here
      default:
        console.error(`Unknown message type: ${messageType}`);
        return;
    }
  
    // Now select a random message from the appropriate array
    let randomIndex = Math.floor(Math.random() * messages.length);
    let selectedMessage = messages[randomIndex];
  
    // This is where you would do something with optionalParameters, if needed  
    let curMessage = null;
    
    
    // add you were run over hitCounter times to curMessage
    curMessage = `<h1>"${selectedMessage.header}" – Mr. ${killVehicle}</h1> You've been run over ${hitCounter} times${selectedMessage.content}`;

    return curMessage;

  }
  
  
