import { Divider, Layout, Text } from "@ui-kitten/components";
import React from "react";
// ✅ IMPORTANDO ScrollView E GARANTINDO ROLAGEM DE TUDO
import { ScrollView, View } from "react-native";
// IMPORTANTE: Assumindo que esses imports estão corretos em sua estrutura de pastas
import { ProjectCard } from "../../components/memberCard";
// ✅ IMPORTANDO DIRETAMENTE AS VARIÁVEIS DO ARQUIVO DE DADOS
import { appTechStack, members } from "../../data/membros";

// ----------------------------------------------------
// DADOS: TIPAGEM (Necessário se as variáveis vêm de um arquivo externo)
// ----------------------------------------------------
// Assumindo que 'members' tem uma propriedade 'id'
interface Member { id: string; [key: string]: any; } 
// Nota: 'members' e 'appTechStack' são importados, então não precisam ser redefinidos, mas a interface 'Member' pode ser útil se não estiver em outro lugar.

// ----------------------------------------------------
// COMPONENTE SIMPLIFICADO DE EXIBIÇÃO DA STACK
// ----------------------------------------------------
const SimpleAppTechStackSection = () => {
    // Junta as tecnologias em uma única string, separadas por vírgula e espaço
    const techList = appTechStack.join(' | ');
    
    return (
        <View style={{ marginBottom: 20, paddingVertical: 10 }}>
            <Text category="s1" style={{ marginBottom: 5, fontWeight: 'bold', color: '#333' }}>
                🛠️ Tech Stack deste Aplicativo:
            </Text>
            <Text category="p2" appearance="hint">
                {techList}
            </Text>
            {/* Usando Divider do UI Kitten para uma separação mais elegante */}
            <Divider style={{ marginTop: 10 }} /> 
        </View>
    );
};


export default function ProjectsScreen() {
  
  return (
    // Mantém o Layout principal
    <Layout style={{ flex: 1, backgroundColor: '#fff' }}>
      
      {/* ✅ USANDO SCROLLVIEW PARA GARANTIR QUE TODO O CONTEÚDO ROLE */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        // Aplica o padding geral a todo o conteúdo rolante
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 30, paddingBottom: 20 }}
      >
        
        {/* TÍTULO PRINCIPAL */}
        <Text category="h2" style={{ marginBottom: 10, fontWeight: 'bold' }}>
            PWM-Hunter
        </Text>

        {/* SEÇÃO DE TECNOLOGIAS */}
        <SimpleAppTechStackSection />
        
        {/* TÍTULO DA LISTA DE MEMBROS */}
        <Text category="h6" style={{ marginTop: 10, marginBottom: 10, fontWeight: 'bold' }}>
            Contribuições Individuais:
        </Text>

        {/* ✅ MAPEANDO OS MEMBROS DIRETAMENTE NA SCROLLVIEW */}
        {/* Usamos o map em ScrollView, pois é o padrão de rolagem que você solicitou */}
        {members.map((item) => (
            // A View com a key é crucial para o desempenho do React
            <View key={item.id}>
                <ProjectCard membros={item} />
            </View>
        ))}

      </ScrollView>
    </Layout>
  );
}