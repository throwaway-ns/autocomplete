# Autocomplete

You task is to implement an AutocompleteInput component that supports asynchronous suggestions loading. Then please answer few questions.

## Task

Implement a Text input component that accepts user's input and fetches suggestions from `/api/suggest` using `fetch` API by utilizing the `term` query parameter. Suggestions are rendered below the input in a dropdown menu. Please refer to `api-mock.ts` file to see the implementation.

Please document the component so it's easy to use and enforce correct usage of the component.

Because we don't expect you to code the perfect solution, please write down possible edge cases of your component's design and possible solutions for them. As an example one possible edge case is the input really near the bottom edge of the browser window. There is no space for dropdown menu, what should the input do?

**⚠️ please don't spend more than 4 hours on this challenge**

## Behaviour

[x] When user types something into the input please fetch suggestions from the API.
[x] Please provide visual feedback to the user of their actions and what is happening
[x] When suggestions are loaded, please offer them in a dropdown menu.
[x] When suggestion is clicked, please change the value of the input to the suggestion's value.
[x] We don't want to fetch data from API on each key stroke. Please implement some sort of mechanism to avoid fetching on each key stroke.

## Restrictions

- You can use either Javascript or Typescript as programming language.
- Please don't use any libraries except React and css-in-js libraries.
- You can google

## Questions

We'd like to know your thinking and opinions, please answer following questions. Please keep it short, 3 sentences should be more than enough.

1. Please write down how would you control the component using the keyboard only and why?

There are three events that I can think of as useful keyboard events to listen for:
- keydown for down arrow
- keydown for up arrow
- keyup for enter

Without trying anything out, my first plan of action would be to attach these listeners 
on mount of the autocomplete component and retain a reference to the currently highlighted
suggestion ID. This could be passed down to the SuggestionList as part of the props to 
change classes/styles.

Similarly, this reference could be used to trigger the existing callback that sets the
term on click, except in this case we can do it on enter keyup.

Binding the navigation logic to the autocomplete component makes it more re-usable and
keeps state manipulation to the right scope. We have knowledge of whether the input
is in focus etc. and the suggestion list can be later decoupled if needds be.

2. How would you do this component API agnostic and why? Imagine there is a requirement to use this component with different APIs and render different options for each API. For example, for an autocomplete for users we would like to render their profile pictures and names. For places we'd like to render an icon, place name and its country.

If there were more search services, I would likely abstract the fetching logic to a service
for that specific API.

Though I didn't use Typescript here for simplicity's sake, creating an interface  for a
SuggestionService that translates the `term` into the right query param and returns a list
of results would be simple and esay to implement for each specific API.

This could then be implemented and passed into the autocomplete component as a prop, e.g.
```
  <Autocomplete service={NameSuggestionsService} />
```

Depending on how we implement the suggestions services, we could either couple the rendering
of the results to the service (keeping the data transformations together) or we could
split the rendering out to individual components. This might look something like

```
  <Autocomplete service={NameSuggestionsService} renderItem={({ photoUrl, name }) => <Avatar image={photoUrl} name={name} />} />
```

3. How would you offer the user with last inputs they used? Restrict this only to a frontend solution as you don't have an API for that. As an example imagine this component being used to fill in the delivery address.

By far the simplest and easiest solution is to make use of the HTML5 autocomplete attribute. This brings a number of benefits if this is used in a proper form.

Outside of this possibility, if the data is not sensitive I'd likely make use of 
the browser's localStorage capabilities. IndexedDB is the final fallback.

4. Approximately how long did you spend on the task?

Going off my commit times... about 4 hours.

## How we will assess your solution

We'll evaluate your solution based on:

1. Code maintainability
2. User experience
3. Whether it works
