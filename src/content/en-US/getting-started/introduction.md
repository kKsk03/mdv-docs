<script setup lang="ts">
import { MdvIcon } from '@mdv-ui/mdv'
import appsIcon from '@iconify-icons/material-symbols/apps'
import ComponentLibrary from '@/components/docs/ComponentLibrary.vue'
</script>

# Introduction

MDV (`@mdv-ui/mdv`) is a Material Design 3 component library for Vue 3. Use it to add UI controls, navigation, and feedback to an existing Vue application.

## What you need

MDV requires Vue 3 (version 3.5 or later) and Tailwind CSS v4. The package includes TypeScript declarations and separate stylesheets for the theme and components. Your application uses Tailwind to generate the utility classes that MDV needs; the package does not ship precompiled Tailwind utilities.

## <MdvIcon :icon="appsIcon" class="me-2 inline-block align-[-0.15em] text-mdv-primary" /> Component Library

<ComponentLibrary locale="en-US" />

## Get started

1. Follow [Setup](/en-US/getting-started/setup) to install MDV and configure Tailwind and the stylesheets in your project.
2. Try the [Button variants demo](/en-US/components/button#variants). Compare the styles, then open the example source to see how to import and use `MdvButton`.
3. If you are building a form, try the [Text Field validation demo](/en-US/components/text-field#native-forms-and-validation). Submit an invalid email address, then correct it and submit again to see how native validation and form submission work together.
