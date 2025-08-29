import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";

interface Message {
  id: string;
  texto: string;
  remetente: string;
  dataHora: string;
}

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const API_URL = "https://68b0a4823b8db1ae9c04920b.mockapi.io/messages"; 

  const fetchMessages = async () => {
    try {
      const res = await fetch(API_URL);
      const data: Message[] = await res.json();
      setMessages(data.reverse()); 
    } catch (error) {
      console.error(error);
    }
  };

 
  const sendMessage = async () => {
    if (text.trim() === "") return;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        texto: text,
        remetente: "User", 
        dataHora: new Date(),
      }),
    });
    setText("");
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const date = new Date(item.dataHora);
          const formattedDate = date.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <View style={styles.messageBox}>
              <Text style={styles.message}>
                {item.remetente}: {item.texto}
              </Text>
              <Text style={styles.timestamp}>{formattedDate}</Text>
            </View>
          );
        }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Digite sua mensagem..."
        />
        <Button title="Enviar" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  messageBox: { marginBottom: 12, padding: 8, backgroundColor: "#f2f2f2", borderRadius: 8 },
  message: { fontSize: 16 },
  timestamp: { fontSize: 12, color: "gray", marginTop: 4 },
  inputContainer: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  input: { flex: 1, borderWidth: 1, padding: 8, marginRight: 10, borderRadius: 5 },
});
