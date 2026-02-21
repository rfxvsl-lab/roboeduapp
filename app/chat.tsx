import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'instructor';
  time: string;
}

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Halo! Saya Instruktur RoboEdu. Ada materi yang bikin kamu bingung?', sender: 'instructor', time: '10:00' }
  ]);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newUserMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    // TODO: Ganti dengan fetch ke API Gemini/OpenAI
    setTimeout(() => {
      const replyText = "Saya sedang menganalisis pertanyaanmu tentang hardware tersebut...";
      
      const newBotMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: 'instructor',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.chatArea}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.warningBox}>
            <Ionicons name="information-circle" size={16} color="#3b82f6" />
            <Text style={styles.warningText}>Tanya jawab seputar materi, error code, atau hardware.</Text>
          </View>
        }
        renderItem={({ item: msg }) => (
          <View style={[styles.messageWrapper, msg.sender === 'user' ? styles.wrapperUser : styles.wrapperBot]}>
            {msg.sender === 'instructor' && (
              <Image source={{ uri: 'https://ui-avatars.com/api/?name=Instruktur&background=3b82f6&color=fff' }} style={styles.avatar} />
            )}
            
            <View style={[styles.bubble, msg.sender === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.timeText}>{msg.time}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={isTyping ? (
          <View style={[styles.messageWrapper, styles.wrapperBot]}>
            <Image source={{ uri: 'https://ui-avatars.com/api/?name=Instruktur&background=3b82f6&color=fff' }} style={styles.avatar} />
            <View style={[styles.bubble, styles.bubbleBot]}><Text style={styles.messageText}>Sedang mengetik...</Text></View>
          </View>
        ) : null}
        ref={flatListRef}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputArea}>
        <TextInput 
          style={styles.input}
          placeholder="Ketik pertanyaanmu..."
          placeholderTextColor="#64748b"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage} activeOpacity={0.7}>
          <Ionicons name="send" size={20} color="#020617" style={{marginLeft: 4}} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  chatArea: { flex: 1, padding: 20 },
  warningBox: { flexDirection: 'row', backgroundColor: '#1e3a8a30', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#1e3a8a', alignItems: 'center', marginBottom: 25 },
  warningText: { color: '#93c5fd', fontSize: 12, marginLeft: 8 },
  messageWrapper: { flexDirection: 'row', marginBottom: 20, alignItems: 'flex-end' },
  wrapperUser: { justifyContent: 'flex-end' },
  wrapperBot: { justifyContent: 'flex-start' },
  avatar: { width: 35, height: 35, borderRadius: 17.5, marginRight: 10 },
  bubble: { maxWidth: '75%', padding: 15, borderRadius: 20 },
  bubbleUser: { backgroundColor: '#f59e0b', borderBottomRightRadius: 5 },
  bubbleBot: { backgroundColor: '#1e293b', borderBottomLeftRadius: 5, borderWidth: 1, borderColor: '#334155' },
  messageText: { color: '#f8fafc', fontSize: 14, lineHeight: 22 },
  timeText: { color: '#94a3b8', fontSize: 10, alignSelf: 'flex-end', marginTop: 8 },
  inputArea: { flexDirection: 'row', padding: 15, backgroundColor: '#0f172a', borderTopWidth: 1, borderTopColor: '#1e293b', alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: '#1e293b', color: 'white', padding: 15, borderRadius: 25, maxHeight: 100, fontSize: 14 },
  sendBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f59e0b', justifyContent: 'center', alignItems: 'center', marginLeft: 15, marginBottom: 2 }
});