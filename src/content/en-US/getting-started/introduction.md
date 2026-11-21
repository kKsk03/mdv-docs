# Introduction

MDV (`@mdv-ui/mdv`) is a Material Design 3 component library for Vue 3. Use it to add UI controls, navigation, and feedback to an existing Vue application.

## What you need

MDV requires Vue 3 (version 3.5 or later) and Tailwind CSS v4. The package includes TypeScript declarations and separate stylesheets for the theme and components. Your application uses Tailwind to generate the utility classes that MDV needs; the package does not ship precompiled Tailwind utilities.

## Find a component

Start with the task your interface needs to support:

- **Actions:** Use a [Button](/en-US/components/button) for a labeled action or an [Icon Button](/en-US/components/icon-button) for a compact action.
- **Forms:** Collect text with a [Text Field](/en-US/components/text-field) or let users choose a time with the [Time Picker](/en-US/components/time-picker).
- **Content:** Group related information in a [Card](/en-US/components/card) or arrange a series of items in a [List](/en-US/components/list).
- **Navigation:** Put destinations in a [Navigation Drawer](/en-US/components/navigation-drawer) or switch between related views with [Tabs](/en-US/components/tabs).
- **Overlays and feedback:** Ask for confirmation in a [Dialog](/en-US/components/dialog), describe a control with a [Tooltip](/en-US/components/tooltip), or show a brief status message in a [Snackbar](/en-US/components/snackbar).

## Get started

1. Follow [Setup](/en-US/getting-started/setup) to install MDV and configure Tailwind and the stylesheets in your project.
2. Try the [Button variants demo](/en-US/components/button#variants). Compare the styles, then open the example source to see how to import and use `MdvButton`.
3. If you are building a form, try the [Text Field validation demo](/en-US/components/text-field#native-forms-and-validation). Submit an invalid email address, then correct it and submit again to see how native validation and form submission work together.
