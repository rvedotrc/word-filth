# Vocab, Questions, and Question Merging

## Vocab

The starting point in Word Filth is _vocabulary_.

There are three different sources of vocab, all of which
get merged together:

 * The built-in verb list (this can be disabled in Settings)
 * Your custom vocab
 * The Babbel vocab list (this can be enabled in Settings) 

In the vocab page, the built-in and Babbel entries are shaded,
to indicate that they cannot be edited like custom vocab entries
can. You can, however, "edit" a built-in verb and save it as a
custom vocab entry, thus hiding the original built-in entry.

Each vocab entry can generate one or more _questions_.
 
# Questions

A _question_ in this context means "a question and its correct answers".

There are several different forms of questions in Word Filth.
For example:

 * Given the english of a verb, what is the Danish/Norwegian infinitive?
 * Given the gender and indefinite singular of a noun, what is it in English?
 * Given the grund form of an adjective, what are its t- and lang forms,
   comparative and superlative?

and so on.

The questions generated from each vocab entry depend on the type of entry
that it is (noun, verb, adjective, phrase, Babbel), and the data available
(e.g. whether or not the vocab entry has English filled in).

It is not currently easily possible to see what questions a vocab item
generates.

# Question Merging

Having generated all the possible questions from all vocab, Word Filth then
performs _question merging_. Effectively, this means that if there are two
or more Questions-with-Answers where the actual _question_ part (e.g.
"How do you say 'en hund' in English?") is identical, then they will be
merged together, combining their allowable correct answers.

Example: suppose you have these two verb vocab entries, each of which
generates two questions. First,

 * vocab entry "at prøve", with the english "to try"
   * question: "How do you say 'at prøve' in English?"; answer: "to try" 
   * question: "How do you say 'to try' in Danish?"; answer: "at prøve" 

but also:

 * vocab entry "at forsøge", with the english "to try"
   * question: "How do you say 'at forsøge' in English?"; answer: "to try" 
   * question: "How do you say 'to try' in Danish?"; answer: "at forsøge" 

Note that the question "How do you say 'to try' in Danish?" appears twice,
with conflicting answers.

After question merging, the list of questions is:

 * "How do you say 'at prøve' in English?"; answer: "to try" 
 * "How do you say 'at forsøge' in English?"; answer: "to try" 
 * "How do you say 'to try' in Danish?"; answer: either "at prøve" or "at forsøge" 
 
When answering that last question, either answer is acceptable.

The "practice" page and the "results" page both work with the _merged_ list of questions.
