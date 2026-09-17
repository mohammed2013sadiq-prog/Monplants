import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/constants/colors';
import api from '../src/services/api';
import { AVATAR_IMAGES } from '../src/constants/plantImages';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    sender: 'bot',
    text:
      'Bonjour ! Je suis votre spécialiste botaniste MoPlants. Comment puis-je vous aider avec vos plantes aujourd’hui ?',
    time: 'Today'
  }
];

const DEFAULT_SUGGESTIONS = [
  'Comment arroser mon Arganier ?',
  'Entretien de l\'Olivier en pot',
  'Soin du Palmier Dattier',
  'Pourquoi les feuilles jaunissent ?'
];

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [suggestions, setSuggestions] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await api.post('/ai/chat', { message: query });
      const botReply = response.data?.reply || 'Je prends note pour le soin de vos plantes !';
      if (response.data?.suggestions && Array.isArray(response.data.suggestions)) {
        setSuggestions(response.data.suggestions);
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      // Intelligent botanical engine fallback
      const lower = query.toLowerCase();
      let fallbackReply = "Pour maintenir la vitalité de vos plantes, assurez un bon drainage et adaptez l'arrosage selon la saison.";
      let newSuggestions = DEFAULT_SUGGESTIONS;

      if (lower.includes('argan')) {
        fallbackReply = "🌿 L'Arganier (Argania spinosa) requiert très peu d'eau et une exposition plein soleil (6h+ direct). En pot, arrosez avec modération tous les 12 à 15 jours uniquement lorsque le substrat est sec.";
        newSuggestions = ['Quel sol pour l\'arganier ?', 'Peut-on tailler l\'arganier ?'];
      } else if (lower.includes('oliv')) {
        fallbackReply = "🫒 Pour l'Olivier (Olea europaea), privilégiez le plein soleil et un arrosage tous les 10 à 14 jours. Évitez absolument l'eau stagnante dans la coupelle pour préserver les racines.";
        newSuggestions = ['Mes feuilles d\'olivier jaunissent', 'Taille de l\'olivier en mars'];
      } else if (lower.includes('palm') || lower.includes('dattier')) {
        fallbackReply = "🌴 Le Palmier Dattier (Phoenix dactylifera) adore la chaleur et le soleil. Arrosez généreusement à la base quand la terre est sèche, sans jamais mouiller le cœur des palmes.";
        newSuggestions = ['Bout des palmes marron', 'Fréquence d\'arrosage en hiver'];
      } else if (lower.includes('jaune') || lower.includes('yellow')) {
        fallbackReply = "⚠️ Les feuilles qui jaunissent sont causées à 90% par un excès d'eau ou un pot mal drainé. Laissez la terre sécher sur 3 cm avant de ré-arroser et videz la soucoupe.";
        newSuggestions = ['Comment tester l\'humidité du sol ?', 'Signes de pourriture des racines'];
      } else if (lower.includes('parasit') || lower.includes('insect') || lower.includes('tache')) {
        fallbackReply = "🛡️ Pour éliminer pucerons et cochenilles : diluez 1 cuillère à soupe de savon noir liquide dans 1 litre d'eau tiède et pulvérisez le soir sous et sur les feuilles.";
        newSuggestions = ['Taches blanches oïdium', 'Moucherons de terreau'];
      }

      setSuggestions(newSuggestions);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: fallbackReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Image source={AVATAR_IMAGES.ai_bot} style={styles.headerBotAvatar} />
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Dr. MoPlants AI</Text>
          <Text style={styles.headerSub}>Botanical Specialist • Online</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="sparkles" size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isUser = item.sender === 'user';
          return (
            <View
              style={[
                styles.messageBubble,
                isUser ? styles.userBubble : styles.botBubble
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isUser ? styles.userText : styles.botText
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  isUser ? styles.userTime : styles.botTime
                ]}
              >
                {item.time}
              </Text>
            </View>
          );
        }}
        ListFooterComponent={
          isLoading ? (
            <View style={styles.typingIndicator}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text style={styles.typingText}>MoPlants AI is diagnosing...</Text>
            </View>
          ) : null
        }
      />

      {/* Suggestion Chips */}
      <View style={styles.suggestionsRow}>
        {suggestions.map((sug, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.sugPill}
            onPress={() => sendMessage(sug)}
          >
            <Text style={styles.sugPillText} numberOfLines={1}>
              {sug}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Chat Input Bar */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachBtn}>
          <Ionicons name="add-circle-outline" size={24} color={Colors.textMuted} />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="Ask about your plants..."
          placeholderTextColor={Colors.textMuted}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => sendMessage()}
        />

        <TouchableOpacity
          style={styles.sendBtn}
          onPress={() => sendMessage()}
          disabled={!inputText.trim()}
        >
          <Ionicons
            name="send"
            size={18}
            color={inputText.trim() ? '#FFFFFF' : Colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 54,
    paddingBottom: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F4EFE6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerBotAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 8,
    borderWidth: 1.5,
    borderColor: '#BCEECF'
  },
  headerCenter: {
    flex: 1,
    alignItems: 'flex-start'
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primary
  },
  headerSub: {
    fontSize: 11,
    color: Colors.textMuted
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF7EE',
    alignItems: 'center',
    justifyContent: 'center'
  },
  messagesList: {
    padding: 20,
    paddingBottom: 10
  },
  messageBubble: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: 18,
    marginBottom: 12
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEAE2',
    borderBottomLeftRadius: 4
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20
  },
  botText: {
    color: Colors.textPrimary
  },
  userText: {
    color: '#FFFFFF'
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end'
  },
  botTime: {
    color: Colors.textMuted
  },
  userTime: {
    color: 'rgba(255,255,255,0.7)'
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10
  },
  typingText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic'
  },
  suggestionsRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  sugPill: {
    backgroundColor: '#EBF7EE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1F2D9'
  },
  sugPillText: {
    fontSize: 12,
    color: Colors.primaryMedium,
    fontWeight: '600'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight
  },
  attachBtn: {
    padding: 6
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F4F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    marginHorizontal: 8,
    color: Colors.textPrimary
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
