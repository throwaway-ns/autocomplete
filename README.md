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
[ ] We don't want to fetch data from API on each key stroke. Please implement some sort of mechanism to avoid fetching on each key stroke.

## Restrictions

- You can use either Javascript or Typescript as programming language.
- Please don't use any libraries except React and css-in-js libraries.
- You can google

## Questions

We'd like to know your thinking and opinions, please answer following questions. Please keep it short, 3 sentences should be more than enough.

1. Please write down how would you control the component using the keyboard only and why?

// @TODO answer

2. How would you do this component API agnostic and why? Imagine there is a requirement to use this component with different APIs and render different options for each API. For example, for an autocomplete for users we would like to render their profile pictures and names. For places we'd like to render an icon, place name and its country.

// @TODO answer

3. How would you offer the user with last inputs they used? Restrict this only to a frontend solution as you don't have an API for that. As an example imagine this component being used to fill in the delivery address.

// @TODO answer

4. Approximately how long did you spend on the task?

// @TODO answer

## How we will assess your solution

We'll evaluate your solution based on:

1. Code maintainability
2. User experience
3. Whether it works
