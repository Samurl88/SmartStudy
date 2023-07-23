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
 

textbook = """Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles.[2]: 1.1  It is the foundation of all quantum physics including quantum chemistry, quantum field theory, quantum technology, and quantum information science.

Classical physics, the collection of theories that existed before the advent of quantum mechanics, describes many aspects of nature at an ordinary (macroscopic) scale, but is not sufficient for describing them at small (atomic and subatomic) scales. Most theories in classical physics can be derived from quantum mechanics as an approximation valid at large (macroscopic) scale.[3]

Quantum mechanics differs from classical physics in that energy, momentum, angular momentum, and other quantities of a bound system are restricted to discrete values (quantization); objects have characteristics of both particles and waves (wave–particle duality); and there are limits to how accurately the value of a physical quantity can be predicted prior to its measurement, given a complete set of initial conditions (the uncertainty principle).

Quantum mechanics arose gradually from theories to explain observations that could not be reconciled with classical physics, such as Max Planck's solution in 1900 to the black-body radiation problem, and the correspondence between energy and frequency in Albert Einstein's 1905 paper, which explained the photoelectric effect. These early attempts to understand microscopic phenomena, now known as the "old quantum theory", led to the full development of quantum mechanics in the mid-1920s by Niels Bohr, Erwin Schrödinger, Werner Heisenberg, Max Born, Paul Dirac and others. The modern theory is formulated in various specially developed mathematical formalisms. In one of them, a mathematical entity called the wave function provides information, in the form of probability amplitudes, about what measurements of a particle's energy, momentum, and other physical properties may yield."""



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
        openai = OpenAI(max_tokens=1000)
        PROMPT = PromptTemplate.from_template(template=test_pt)
        response = openai(PROMPT.format(context=textbook))
        print(cb)
    return response

# print(get_test_from_textbook(textbook))