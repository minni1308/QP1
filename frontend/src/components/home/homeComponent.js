import React, { useState }  from "react";
import {
  Provider,
  Heading,
  Subhead,
  Flex,
  Box,
  Text,
} from "rebass";
import { Hero, CallToAction, Feature } from "react-landing-page";


const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      width={[1, 1 / 2]} // Two columns on larger screens, one column on smaller screens
      p={3}
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
        cursor: "pointer",
        marginBottom: "16px",
        backgroundColor: "white",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        },
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <Flex justifyContent="space-between" alignItems="center">
        <Text
          fontSize={[1,2]} // Decreased font size for the question
          fontWeight="bold"
          color={isOpen ? "blue" : "black"}
        >
          {question}
        </Text>
        <Text fontSize={[2]} color="black">
          {isOpen ? "−" : "+"} {/* Toggle symbol */}
        </Text>
      </Flex>
      {isOpen && (
        <Text fontSize={[1]} color="black" mt={2}>
          {answer}
        </Text>
      )}
    </Box>
  );
};

const HomeComponent = () => {
  return (
    <Provider>
      {/* Hero Section */}
      <Hero
        color="black"
        bg="white"
        backgroundImage="/bg1.jpg"
        style={{
          textAlign: "center",
          padding: "50px 20px",
        }}
      >
        <Heading fontSize={[5, 6]} color="black">
          Create Question Papers Online
        </Heading>
        <Subhead fontSize={[1,2]} color="black" mt={2}>
          QPG helps schools, coaching institutes, teachers, and tutors
          create question papers and online tests in minutes.
        </Subhead>
        <Flex mt={4} justifyContent="center">
          <CallToAction href="/signup" mr={3} bg="blue" color="white">
            Get Started
          </CallToAction>
        </Flex>
        <Box mt={4}>
          <img
            src="/intro4.png"
            alt="Laptop"
            style={{ width: "100%", maxWidth: "600px" }}
          />
        </Box>
      </Hero>

      {/* Features Section */}
      <Box bg="lightgray" py={5}>
        <Heading textAlign="center" fontSize={[4, 5]} color="black">
          What is inside?
        </Heading>
        <Flex flexWrap="wrap" justifyContent="center" mt={4}>
          <Feature icon="⌨" description="Insert New Questions for Subjects">
            Insert
          </Feature>
          <Feature icon="💻" description="Generate Unique Question Papers">
            Generate
          </Feature>
          <Feature icon="⌫" description="Select, Modify and Delete Questions">
            Edit
          </Feature>
        </Flex>
      </Box>

      {/* About the Project Section */}
<Box py={5} bg="white">
  <Heading textAlign="center" fontSize={[4, 5]} color="black">
    About the Project
  </Heading>
  <Flex flexWrap="wrap" justifyContent="center" mt={4}>
    <Feature
      icon="📘"
      description="Effortlessly create question papers with a user-friendly interface designed for teachers and educational institutions."
    >
      Easy to Use
    </Feature>
    <Feature
      icon="🎯"
      description="Generate unique question papers with randomized questions to ensure fairness and variety in exams."
    >
      Unique Papers
    </Feature>
    <Feature
      icon="⚙️"
      description="Edit, modify, and manage your question bank with advanced tools for customization."
    >
      Customizable
    </Feature>
    <Feature
      icon="📊"
      description="Save time and effort with automated processes for creating, organizing, and managing question papers."
    >
      Time-Saving
    </Feature>
  </Flex>
</Box>

      {/* FAQ Section */}
      {/* FAQ Section */}
      <Box py={5} bg="#f9f9f9">
        <Heading textAlign="center" fontSize={[4, 5]} color="black" mb={3}>
          Frequently Asked Questions
        </Heading>
        <Text textAlign="center" fontSize={[2, 3]} color="black" mb={4}>
          Here are answers to some common questions asked by the teachers.
        </Text>
        <Flex flexWrap="wrap" justifyContent="center" px={3}>
          <FAQItem
            question="How many papers can I create using NCERT questions?"
            answer="Unlimited papers. You can create unlimited papers for free using NCERT textbook questions. It is the perfect solution to create question papers and worksheets for your students."
          />
          <FAQItem
            question="What will happen to my unused papers?"
            answer="Unused papers will remain in your account and can be used anytime before the package expires."
          />
          <FAQItem
            question="What if my paper count becomes zero before package expiry date?"
            answer="You can purchase additional papers or upgrade your package to continue creating question papers."
          />
          <FAQItem
            question="What if the papers remain but online test attempts are exhausted?"
            answer="You can purchase additional test attempts to continue conducting online tests."
          />
          <FAQItem
            question="How do you count my papers?"
            answer="Each unique question paper you generate is counted as one paper, regardless of the number of questions it contains."
          />
          <FAQItem
            question="What are online test attempts?"
            answer="Online test attempts refer to the number of times students can attempt the tests you create on the platform."
          />
          <FAQItem
            question="Can we download the question paper as a Word file?"
            answer="Yes, you can download the question papers in Word or PDF format for offline use."
          />
          <FAQItem
            question="What is Free Mobile App?"
            answer="The free mobile app allows you to access all features of the platform on your mobile device, making it easier to create and manage question papers on the go."
          />
        </Flex>
      </Box>
    </Provider>
  );
};

export default HomeComponent;