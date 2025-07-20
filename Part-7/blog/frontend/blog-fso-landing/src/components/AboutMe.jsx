const AboutMe = () => {
  return (
    <section className="mt-4 w-full bg-white p-4 md:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-4 text-2xl font-bold text-[#004a55]">👋 Hey there!</h2>

        <p className="text-base leading-relaxed text-gray-700 md:text-lg">
          I’m a JavaScript developer with 6 years of commercial experience in eCommerce, primarily
          working with Salesforce Commerce Cloud on large-scale international projects. I’ve
          delivered complex client- and server-side solutions across diverse domains.
        </p>

        <p className="mt-6 text-base leading-relaxed text-gray-700 md:text-lg">
          This full-stack blog project is part of my self-education – a return to React and Node.js,
          which I first explored about 7 years ago at a tech school. Now, I’m actively integrating
          them into my professional stack – and loving every minute of it.
        </p>
      </div>
    </section>
  );
};

export default AboutMe;
