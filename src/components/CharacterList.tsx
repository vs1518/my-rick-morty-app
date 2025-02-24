import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CHARACTERS } from "../graphql/queries";
import { GetCharactersQuery } from "../graphql/generated";
import { motion } from "framer-motion";
import { styled } from "@mui/material/styles";
import { Button, LinearProgress, Typography } from "@mui/material";

const CharacterList = ({ onSelect }: { onSelect: (id: string) => void }) => {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useQuery<GetCharactersQuery>(GET_CHARACTERS, {
    variables: { page },
  });

  if (loading) return <div className="animate-pulse text-center"><LinearProgress color="success" /></div>;
  if (error) return <p className="text-red-500">Erreur : {error.message}</p>;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.5,
     },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1, 
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.3 
      } 
    },
    exit: {
      opacity: 0,
      y: -50,
      scale: 0.5,
      transition: { duration: 0.3 }
    }
  };

  return (  
    <div className="container mx-auto p-4">
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" 
        variants={containerVariants} 
        initial="hidden" 
        animate="show"
      >
        {data?.characters?.results?.map((char) => (
          <motion.div 
            key={char?.id} 
            className="w-full" 
            variants={itemVariants}
            style={{ originY: 0 }}
            
          >
            <motion.div
              className="rounded overflow-hidden shadow-lg bg-green-500 hover:scale-105 transition-transform duration-200 cursor-pointer"
              onClick={() => onSelect(char?.id || "")}
              whileHover={{ scale: 1.05, boxShadow: "0px 0px 10px rgba(0,0,0,0.5)" }}
              transition={{ duration: 0.2 }}
            >
              <img
                className="w-full h-40 object-cover"
                src={char?.image || ""}
                alt={char?.name || ""}
              />
              <div className="px-6 py-4">
                <div className="text-xl mb-2" style={{ fontFamily: "Creepster" }}>{char?.name}</div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <button className="bg-green-500 py-2 px-4 rounded mt-4" style={{ fontFamily: "Creepster" }} onClick={() => setPage((p) => p - 1)}>
        Page Arrière
      </button>
      <button className="bg-green-500 py-2 px-4 rounded mt-4" style={{ fontFamily: "Creepster" }} onClick={() => setPage((p) => p + 1)}>
        Page Suivante
      </button>
    </div>
  );
};

export default CharacterList;
