import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

const quizQuestions: { [key: number]: QuizQuestion[] } = {
  1: [
    {
      question: "Apa nama alat musik tradisional Jawa Barat yang terbuat dari bambu?",
      options: ["Gamelan", "Angklung", "Suling", "Kecapi"],
      correctAnswer: "Angklung"
    },
    {
      question: "Kota Bandung dikenal sebagai kota apa?",
      options: ["Kota Pelajar", "Kota Kembang", "Kota Pahlawan", "Kota Gudeg"],
      correctAnswer: "Kota Kembang"
    },
    {
      question: "Monumen bersejarah di Bandung yang berbentuk tugu bambu runcing adalah...",
      options: ["Monumen Asia Afrika", "Monumen Perjuangan Rakyat Jawa Barat", "Gedung Sate", "Tugu Bandung Lautan Api"],
      correctAnswer: "Tugu Bandung Lautan Api"
    },
    {
      question: "Apa julukan lain dari Kota Bandung yang berarti 'Paris dari Jawa'?",
      options: ["Parijs van Java", "Venice of Java", "London of Java", "Rome of Java"],
      correctAnswer: "Parijs van Java"
    },
    {
      question: "Tari tradisional Sunda yang menggambarkan gerakan burung merak adalah...",
      options: ["Tari Saman", "Tari Jaipong", "Tari Merak", "Tari Piring"],
      correctAnswer: "Tari Merak"
    },
    {
      question: "Situs prasejarah di Jawa Barat yang terkenal dengan penemuan fosil manusia purba adalah...",
      options: ["Situs Sangiran", "Situs Gunung Padang", "Situs Pugung Raharjo", "Situs Batujaya"],
      correctAnswer: "Situs Gunung Padang"
    },
    {
      question: "Kuliner khas Bandung yang terbuat dari aci dan digoreng adalah...",
      options: ["Pempek", "Cilok", "Batagor", "Siomay"],
      correctAnswer: "Cilok"
    },
    {
      question: "Gunung berapi aktif di dekat Bandung yang terkenal dengan kawahnya adalah...",
      options: ["Gunung Semeru", "Gunung Krakatau", "Tangkuban Perahu", "Gunung Merapi"],
      correctAnswer: "Tangkuban Perahu"
    },
    {
      question: "Universitas tertua di Indonesia yang berlokasi di Bandung adalah...",
      options: ["Universitas Gadjah Mada", "Institut Teknologi Bandung (ITB)", "Universitas Indonesia", "Universitas Padjadjaran"],
      correctAnswer: "Institut Teknologi Bandung (ITB)"
    },
    {
      question: "Gedung bersejarah di Bandung yang menjadi lokasi Konferensi Asia Afrika tahun 1955 adalah...",
      options: ["Gedung Merdeka", "Gedung Sate", "Museum Konferensi Asia Afrika", "Istana Negara"],
      correctAnswer: "Gedung Merdeka"
    }
  ],
  2: [
    {
      question: "Sungai terpanjang di Jawa Barat yang melewati Kota Bandung adalah...",
      options: ["Ciliwung", "Citanduy", "Citarum", "Cimanuk"],
      correctAnswer: "Citarum"
    },
    {
      question: "Kerajaan Sunda yang pernah berkuasa di Jawa Barat adalah...",
      options: ["Majapahit", "Sriwijaya", "Tarumanegara", "Pajajaran"],
      correctAnswer: "Pajajaran"
    },
    {
      question: "Alat musik tradisional Sunda yang dimainkan dengan cara dipetik adalah...",
      options: ["Suling", "Angklung", "Kecapi", "Rebab"],
      correctAnswer: "Kecapi"
    },
    {
      question: "Upacara adat Sunda yang berkaitan dengan panen padi adalah...",
      options: ["Sekaten", "Grebeg Maulud", "Seren Taun", "Ngaben"],
      correctAnswer: "Seren Taun"
    },
    {
      question: "Makanan khas Bandung yang terbuat dari tahu dan digoreng dengan bumbu petis adalah...",
      options: ["Tahu Gejrot", "Tahu Sumedang", "Batagor", "Kupat Tahu"],
      correctAnswer: "Kupat Tahu"
    },
    {
      question: "Danau vulkanik di Ciwidey, Bandung, yang terkenal dengan air belerangnya adalah...",
      options: ["Danau Toba", "Danau Singkarak", "Kawah Putih", "Situ Patenggang"],
      correctAnswer: "Kawah Putih"
    },
    {
      question: "Tokoh pahlawan nasional dari Jawa Barat yang terkenal dengan perjuangan kemerdekaan adalah...",
      options: ["Diponegoro", "Cut Nyak Dien", "Otto Iskandar Dinata", "Pattimura"],
      correctAnswer: "Otto Iskandar Dinata"
    },
    {
      question: "Museum di Bandung yang menyimpan koleksi geologi dan fosil adalah...",
      options: ["Museum Nasional", "Museum Fatahillah", "Museum Geologi", "Museum Pos Indonesia"],
      correctAnswer: "Museum Geologi"
    },
    {
      question: "Pasar tradisional di Bandung yang terkenal dengan barang-barang antik dan loaknya adalah...",
      options: ["Pasar Baru", "Pasar Cibaduyut", "Pasar Gedebage", "Pasar Jatayu"],
      correctAnswer: "Pasar Jatayu"
    },
    {
      question: "Pakaian adat tradisional Jawa Barat untuk pria adalah...",
      options: ["Kebaya", "Baju Bodo", "Pangsi", "Ulos"],
      correctAnswer: "Pangsi"
    }
  ],
  3: [
    {
      question: "Siapakah pendiri kota Bandung?",
      options: ["Adipati Ukur", "R.A. Wiranatakusumah II", "Douwes Dekker", "Herman Willem Daendels"],
      correctAnswer: "R.A. Wiranatakusumah II"
    },
    {
      question: "Peristiwa penting di Bandung yang terjadi pada tahun 1946, di mana rakyat membakar kotanya sendiri adalah...",
      options: ["Bandung Lautan Api", "Konferensi Asia Afrika", "Perang Diponegoro", "Sumpah Pemuda"],
      correctAnswer: "Bandung Lautan Api"
    },
    {
      question: "Nama lain dari kereta api gunung di Bandung yang menghubungkan Bandung dengan Pangalengan adalah...",
      options: ["Kereta Wisata", "Kereta Api Cicalengka", "Kereta Api Kertasari", "Kereta Api Jalur Selatan"],
      correctAnswer: "Kereta Api Kertasari"
    },
    {
      question: "Tarian kontemporer yang terinspirasi dari gerakan tari Jaipong adalah...",
      options: ["Tari Topeng", "Tari Saman", "Tari Kontemporer Sunda", "Tari Pendet"],
      correctAnswer: "Tari Kontemporer Sunda"
    },
    {
      question: "Jenis kain tradisional Bandung yang terkenal dengan motif batik khas Sunda adalah...",
      options: ["Batik Pekalongan", "Batik Solo", "Batik Cirebon", "Batik Priangan"],
      correctAnswer: "Batik Priangan"
    },
    {
      question: "Arsitek Belanda yang merancang banyak bangunan ikonik di Bandung, termasuk Gedung Sate, adalah...",
      options: ["Thomas Karsten", "Pieter Moojen", "Willem Jan Marie Anthonie van den Bosch", "J. Gerber"],
      correctAnswer: "J. Gerber"
    },
    {
      question: "Pada masa kolonial Belanda, Bandung dikenal sebagai 'Kota ...' karena banyak pabrik teh dan kina.",
      options: ["Kota Industri", "Kota Dagang", "Kota Perkebunan", "Kota Pelabuhan"],
      correctAnswer: "Kota Perkebunan"
    },
    {
      question: "Istilah 'mojang jajaka' dalam budaya Sunda merujuk pada...",
      options: ["Ayah dan Ibu", "Kakek dan Nenek", "Pemuda dan Pemudi", "Guru dan Murid"],
      correctAnswer: "Pemuda dan Pemudi"
    },
    {
      question: "Filosofi Sunda yang menekankan keseimbangan alam dan hidup sederhana adalah...",
      options: ["Tri Hita Karana", "Pancasila", "Silih Asih, Silih Asah, Silih Asuh", "Bhinneka Tunggal Ika"],
      correctAnswer: "Silih Asih, Silih Asah, Silih Asuh"
    },
    {
      question: "Jenis angkutan umum tradisional di Bandung yang menggunakan kuda adalah...",
      options: ["Delman", "Becak", "Bajaj", "Angkot"],
      correctAnswer: "Delman"
    }
  ]
};

interface GameProps {
  onClose: () => void;
  onComplete: (score: number) => void;
}

interface QuizGameProps extends GameProps {
  level: number;
}

export const QuizGame: React.FC<QuizGameProps> = ({ level, onClose, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null); // To store the selected option
  const [answered, setAnswered] = useState(false); // To track if the current question has been answered

  const questions = quizQuestions[level] || quizQuestions[1]; // Fallback to level 1 if level not found

  const handleAnswer = (option: string) => {
    if (answered) return; // Prevent answering multiple times

    setSelectedOption(option);
    setAnswered(true);

    if (option === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null); // Reset for next question
        setAnswered(false); // Reset for next question
      } else {
        setShowResult(true);
      }
    }, 1000); // 1 second delay to show feedback
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setAnswered(false);
  };

  const handleCompleteQuiz = () => {
    onComplete(score * 10); // Reward 10 points per correct answer
    onClose();
  };

  const progress = ((currentQuestionIndex + (showResult ? 1 : 0)) / questions.length) * 100;

  if (showResult) {
    return (
      <View style={[styles.gameContainer, { justifyContent: 'center' }]}>
        <Text style={styles.gameTitle}>Quiz Selesai!</Text>
        <Text style={styles.gameDescription}>
          Anda menjawab {score} dari {questions.length} pertanyaan dengan benar.
        </Text>
        <TouchableOpacity style={styles.completeButton} onPress={handleCompleteQuiz}>
          <Text style={styles.completeButtonText}>Kembali ke Gamifikasi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={resetQuiz}>
          <Text style={styles.closeButtonText}>Ulangi Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.gameContainer}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.gameTitle}>Quiz Heritage - Level {level}</Text>
      <Text style={styles.questionText}>
        {currentQuestionIndex + 1}. {currentQuestion.question}
      </Text>
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              answered && option === currentQuestion.correctAnswer && styles.correctOption,
              answered && option === selectedOption && option !== currentQuestion.correctAnswer && styles.incorrectOption,
              answered && option !== currentQuestion.correctAnswer && option !== selectedOption && styles.unselectedOption
            ]}
            onPress={() => handleAnswer(option)}
            disabled={answered} // Disable buttons once an answer is chosen
          >
            <Text style={[
                styles.optionText,
                answered && option === currentQuestion.correctAnswer && styles.correctOptionText,
                answered && option === selectedOption && option !== currentQuestion.correctAnswer && styles.incorrectOptionText,
                answered && option !== currentQuestion.correctAnswer && option !== selectedOption && styles.unselectedOptionText
            ]}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Tutup Quiz</Text>
      </TouchableOpacity>
    </View>
  );
};

export const MemoryGame: React.FC<GameProps> = ({ onClose, onComplete }) => {
  return (
    <View style={styles.gameContainer}>
      <Text style={styles.gameTitle}>Memory Game</Text>
      <Text style={styles.gameDescription}>Placeholder for Memory Game logic.</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close Memory Game</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.completeButton} onPress={() => onComplete(50)}>
        <Text style={styles.completeButtonText}>Complete Memory (50 pts)</Text>
      </TouchableOpacity>
    </View>
  );
};

export const SpinTheWheelGame: React.FC<GameProps> = ({ onClose, onComplete }) => {
  return (
    <View style={styles.gameContainer}>
      <Text style={styles.gameTitle}>Spin The Wheel Game</Text>
      <Text style={styles.gameDescription}>Placeholder for Spin The Wheel Game logic.</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close Wheel</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.completeButton} onPress={() => onComplete(75)}>
        <Text style={styles.completeButtonText}>Complete Wheel (75 pts)</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  gameContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA', // Light grey background
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  gameTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#444',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E6ED',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  correctOption: {
    borderColor: '#4CAF50', // Green border
    backgroundColor: '#E8F5E9', // Light green background
  },
  incorrectOption: {
    borderColor: '#F44336', // Red border
    backgroundColor: '#FFEBEE', // Light red background
  },
  unselectedOption: {
    opacity: 0.6, // Dim unselected options
  },
  correctOptionText: {
    color: '#2E7D32', // Darker green text
  },
  incorrectOptionText: {
    color: '#C62828', // Darker red text
  },
  unselectedOptionText: {
    color: '#888', // Grey out text
  },
  closeButton: {
    backgroundColor: '#D1D9E0',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 18,
  },
  completeButton: {
    backgroundColor: '#4CAF50', // Green for completion
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    width: '100%',
    alignItems: 'center',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  gameDescription: { // Used for quiz result screen
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#555',
    lineHeight: 25,
  },
  progressBarContainer: {
    width: '100%',
    height: 10,
    backgroundColor: '#E0E6ED',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6A5ACD', // Purple color for progress
    borderRadius: 5,
  },
});
