# Inflection shortcuts

Given a _base_ word, you can use shortcuts to enter inflections of that base.

You don't have to use inflection shortcuts, but they can help save time and typing
errors.

## Where shortcuts can be used

Inflection shortcuts can be used in the following places, when
adding/editing vocab, or when answering a question of the appropriate type:

| Type | Base word | Use shortcuts for ... |
| ---- | --------- | --------------------- |
| Verb | infinitive (without the "at/å" particle) | nutid, datid, førnutid |
| Noun | indefinite singular | definite singular, indefinite plural, definite plural |
| Adjective | grund form | t-form, lang form, superlative, comparative |

## Syntax

Inflection shortcuts come in two forms: suffix ("-"), and overlap ("..").

 * Use "-xxx" to represent the whole base word followed by (e.g.) xxx.
   * Example 1: "-r" is often good for the present tense of verbs:
     If the infinitive is _[at] lege_ ("to play"), then the base word is
      _lege_, and entering "-r" expands to _leger_.
   * Example 2: If the base word is _hav_ ("sea"), then "-ene" expands
     to _havene_ ("the seas").
   * Example 3: "-" simply expands to the base word, unchanged.
     This can be useful for nouns or adjectives which don't change their form,
     e.g. _lilla_ ("purple").
 * Use ".." to represent an overlap, but with a different ending.
   This works by finding the longest, rightmost overlap.
    * Example 1: If the base word is _[at] beskrive_ ("to describe"),
      then "..rev" would detect that the overlap is just "r" (because "rev"
      and "re" do not exist in the case word, but "r" does), and so expand
      to _beskrev_.
    * Example 2: If the base word is _finger_, then "..grene" expands
      to _fingrene_ ("the fingers").

## Several inflections in one input field

To save time when entering verbs, nouns, or adjectives, a separate "Inflection"
field is provided, where one can enter all the inflections in one go. This is,
again, completely optional; you can always just ignore this field and enter the
inflections individually, or not use inflection shortcuts at all.

 * For verbs:
   * Enter three inflections, separated by commas. e.g. "-r, -de, -t".
     These become the nutid, datid, and førnutid forms.
   * In fact "-r, -de, -t" (verb group 1) is so common, you can just enter "1".
     Likewise for verb group 2 you can just enter "2".
   * The "1" and "2" shortcuts can also be used in the "nutid" field, when
     answering a question.
 * For nouns:
   * Enter three inflections, separated by commas. e.g. "-en, -er, -erne".
     These become the definite singular, indefinite plural,
     and definite plural forms.
   * Or, enter just one inflection. This then becomes the definite singular
     form (also used for pluralis nouns).
 * For adjectives:
   * Enter two inflections, separated by a comma. e.g. "-t, -e".
     These become the t-form and lang form.
   * Or, enter two inflections separated by a comma, then a space, then two
     more separated a comma. e.g. "-t, -e -ere, -est".
     These become the t-form and lang form, then the comparative and superlative.

The inflection syntax, including the multi-inflection syntax, is the same as
is currently used by [Den Danske Ordbog](https://ordnet.dk/ddo/ordbog). This
means that you can often copy and paste the inflection information from DDO
into Word Filth when adding vocabulary.
