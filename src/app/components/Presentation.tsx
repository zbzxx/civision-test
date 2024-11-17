import React from 'react';

interface ProjectInfoProps {
  name: string;
  githubProfile: string;
  linkedinProfile: string;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ name, githubProfile, linkedinProfile }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-6 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Réalisation du projet pour le test de front-end pour Civision
      </h2>
      <div className="flex flex-col items-center">
        <p className="text-lg text-gray-700 mb-4">
          Réalisé par <strong>{name}</strong>
        </p>
        <div className="flex flex-col items-center">
          <a
            href={githubProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-teal-600 mb-2 hover:underline"
          >
            Profil GitHub
          </a>
          <a
            href={linkedinProfile}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xl text-teal-600 mb-2 hover:underline"
          >
            Profil LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
