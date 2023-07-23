import os
from langchain import OpenAI
from langchain.callbacks import get_openai_callback
from langchain.prompts import PromptTemplate
 
os.environ["OPENAI_API_KEY"] = "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"
 
 
flashcards_pt = """

Given the provided information from a textbook, create a JSON object which enumerates a set of 10 child objects.                       
    Each child object has a property named "q" and a property named "a".
    For each child object assign to the property named "q" a question which has its answer in the article 
    and to the property named "a" a short answer to this question.
    The resulting JSON object should be in this format: [{{"q":"string","a":"string"}}]. Optimize your responses such that a student may study these and do well on an upcoming test.

    Information: {context}

    The JSON object:
"""

test_pt = """

Given the provided information from a textbook, create a JSON object which enumerates a set of 10 child objects.
    Each child object has a properties named "q", "a", "b", "c", "real".
    For each child object assign to the property named "q" a question about the article. For property, "real", assign a random letter from "a", "b", or "c". Assign a short answer to question found in the article 
    to the property of the same letter assigned to property "q". For the remaining
    letter properties that do not have the correct answer, generate fake, but convincing answers that are about the same length as 
    the real answer and asign it to them. 
    The resulting JSON object should be in this format: [{{"q":"string", "a":"string", "b":"string", "c":"string", "real": "string"}}]. Optimize your responses such that a student may study these and do well on an upcoming test.

    Information: {context}

    The JSON object:
"""


# Get answers
def get_flashcards_from_textbook(textbook):
    with get_openai_callback() as cb:
        openai = OpenAI(max_tokens=1000)
        PROMPT = PromptTemplate.from_template(template=flashcards_pt)
        response = openai(PROMPT.format(context=textbook))
        print(cb)
    return response


# print(get_flashcards(textbook))


def get_test_from_textbook(textbook):
    with get_openai_callback() as cb:
        openai = OpenAI(max_tokens=2000)
        PROMPT = PromptTemplate.from_template(template=test_pt)
        response = openai(PROMPT.format(context=textbook))
        print(cb)
    return response


# print(get_test_from_textbook(textbook))
