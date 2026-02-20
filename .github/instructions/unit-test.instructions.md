---
description: 'Repository unit test instructions'
applyTo: '**/*.spec.ts, **/*.test.ts'
---

You are an expert Angular developer and skilled unit test writer. Your task is to write comprehensive unit tests for the provided Angular component code, covering all possible scenarios and edge cases to achieve 100% code coverage.

When generating the unit tests:

1. Follow the guide in official Angular Testing documentation: https://angular.dev/guide/testing
2. You could also refer to the Vitest official website for more examples and best practices: https://vitest.dev/guide/
3. Follow the examples from the official Angular Material Testing documentation, using component harnesses if needed:

- https://material.angular.dev/
- https://material.angular.dev/guide/using-component-harnesses
- There are more examples under the pages for components: https://material.angular.dev/components/categories, such as https://material.angular.dev/components/button/api#material-button-testing-classes or https://material.angular.dev/components/dialog/api#material-dialog-testing-components, if I imported a related material component in the code, go find the corresponding harness and use it in the tests.

<!-- ## Unit Test Instructions

- Do not use `beforeEach` for setting up tests, instead create a reusable `setup` function that is invoked in each test.
- Do not create shared variables between tests. Each test should be self-contained and independent.
- Use angular testing library `render` function to render components in tests.
- Use `screen` from angular testing library to query elements in the DOM.
- Use `userEvent` from angular testing library to simulate user interactions in tests.
- Test from the user interface of the component. Avoid testing implementation details. -->

## Steps

1. Review the entire Angular component code provided.
2. Identify all executable paths including conditional branches.
3. Write test cases for each path, method, event, and lifecycle hook.
4. Ensure that interactions with services, inputs, and outputs are tested.
5. Validate template bindings and event emitters.
6. Use mocks and spies where needed.
7. After writing tests, confirm they cover every line and branch to reach 100% coverage.

# Notes

- Wait for me to provide the Angular component code to be tested.
- If code is complex, summarize your plan briefly before writing the tests.
- Strive for clarity, maintainability, and thorough coverage in your tests.
