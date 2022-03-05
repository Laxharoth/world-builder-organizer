# Simple World Build

A simple extension to create files from templates and link files through the folder.
The files are in YAML format.

## Templates

The templates are yaml files and can be to create files from them.
When a file is created from a template there will be a prompt to set each variable in the template.

<img src="https://i.ibb.co/7Rjxshv/Template-Card.png" alt="Template-Card" border="0">

## Link files

Links between content files can be created by writting '+' and then the name of the file. After writting '+' should display an autocomplete with the options.

<img src="https://i.ibb.co/qp8523r/demo-Using-File-Link.gif" alt="demo-Using-File-Link" border="0">

## Commands

|***Command***                    |***Description***                     |
|---------------------------------|--------------------------------------|
|**World Builder: Init World**    |Creates the directory structure<br><ul><li>Two directories one for templates and one for the world content</li><li>Three files: A simple template, A file in the root directory and a file in the world directory.</li></ul>|
|**World Builder: Create Template**|Creates a simple template file        |
|**World Builder: Copy Template**  |Creates a copy of a template file     |
|**World Builder: Create Card**    |Creates a file in the world directory from a template<br>The variables in the template will be prompted for completion.|
 
## Changelog

### 1.0.1

#### Fix

When a description in the yaml file was an object the quickpick would not display.

### 1.0.0

Initial release

-----------------------------------------------------------------------------------------------------------