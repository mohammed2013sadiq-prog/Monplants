import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../src/constants/colors';
import Button from '../src/components/Button';

interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    question: 'Where is the Argan tree (Argania spinosa) naturally endemic?',
    options: ['Southwestern Morocco', 'Northern France', 'Southern Brazil', 'Japan'],
    correctIndex: 0,
    explanation: 'Argan trees are endemic to the calcareous semi-desert valley of the Souss in southwestern Morocco.'
  },
  {
    question: 'What is the ideal watering frequency for an Olive Tree in winter?',
    options: ['Every day', 'Every 2-3 weeks when soil is dry', 'Every 2 hours', 'Never water in winter'],
    correctIndex: 1,
    explanation: 'In winter or dormant periods, olive trees require minimal water, allowing roots to breathe without waterlogging.'
  },
  {
    question: 'Are Hibiscus flowers generally considered toxic to curious household pets?',
    options: ['No, completely safe', 'Yes, toxic to cats and dogs', 'Only seeds are safe', 'Only toxic to birds'],
    correctIndex: 1,
    explanation: 'Certain varieties of Hibiscus contain compounds that can cause mild to moderate digestive irritation in cats and dogs.'
  }
];

export default function QuizScreen() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (showResult) return;
    setSelectedOpt(idx);
    setShowResult(true);
    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setShowResult(false);
    } else {
      // Completed
      setCurrentIdx(QUESTIONS.length);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setShowResult(false);
    setScore(0);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Botanical Quiz</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {currentIdx < QUESTIONS.length ? (
          <>
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                Question {currentIdx + 1} of {QUESTIONS.length}
              </Text>
              <Text style={styles.scoreText}>Score: {score}</Text>
            </View>

            <View style={styles.questionCard}>
              <Text style={styles.questionText}>{currentQ.question}</Text>
            </View>

            <View style={styles.optionsList}>
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let btnStyle: any = styles.optionBtn;
                let textStyle: any = styles.optionText;

                if (showResult) {
                  if (isCorrect) {
                    btnStyle = [styles.optionBtn, styles.optionCorrect];
                    textStyle = [styles.optionText, styles.optionTextCorrect];
                  } else if (isSelected && !isCorrect) {
                    btnStyle = [styles.optionBtn, styles.optionWrong];
                    textStyle = [styles.optionText, styles.optionTextWrong];
                  }
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    disabled={showResult}
                    onPress={() => handleSelectOption(idx)}
                    style={btnStyle}
                  >
                    <Text style={textStyle}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {showResult && (
              <View style={styles.explanationBox}>
                <Text style={styles.explanationTitle}>Did you know?</Text>
                <Text style={styles.explanationText}>{currentQ.explanation}</Text>
                <Button
                  title={currentIdx === QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  onPress={handleNext}
                  variant="primary"
                  style={styles.nextBtn}
                />
              </View>
            )}
          </>
        ) : (
          <View style={styles.resultCard}>
            <View style={styles.trophyCircle}>
              <Ionicons name="trophy" size={44} color="#D97706" />
            </View>
            <Text style={styles.congratsTitle}>Quiz Finished!</Text>
            <Text style={styles.congratsSub}>
              You scored {score} out of {QUESTIONS.length} points.
            </Text>
            <Button
              title="Try Again"
              onPress={handleRestart}
              variant="primary"
              style={styles.restartBtn}
            />
          </View>
        )}
      </ScrollView>
    </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  scrollContent: {
    padding: 20
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14
  },
  progressText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryMedium
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 20
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 26
  },
  optionsList: {
    gap: 12
  },
  optionBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Colors.borderLight
  },
  optionCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32'
  },
  optionWrong: {
    backgroundColor: '#FFEBEE',
    borderColor: '#C62828'
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary
  },
  optionTextCorrect: {
    color: '#1B5E20'
  },
  optionTextWrong: {
    color: '#B71C1C'
  },
  explanationBox: {
    marginTop: 20,
    backgroundColor: '#FAF8F5',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EFEAE2'
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.earthBrownLight
  },
  explanationText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 18
  },
  nextBtn: {
    marginTop: 16
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginTop: 40,
    borderWidth: 1,
    borderColor: Colors.borderLight
  },
  trophyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  congratsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary
  },
  congratsSub: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 6,
    marginBottom: 24
  },
  restartBtn: {
    width: '100%'
  }
});
