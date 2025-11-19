import { useState, useRef, useEffect } from 'react';
import { FiChevronLeft, FiPlus, FiTrendingUp, FiCamera } from 'react-icons/fi';
import { geminiService } from '../services/gemini';
import { storage } from '../services/storage';

const FoodTracking = () => {
  const [meals, setMeals] = useState(storage.getMeals());
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    storage.saveMeals(meals);
  }, [meals]);

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  const totalFats = meals.reduce((sum, meal) => sum + (meal.fats || 0), 0);
  const dailyGoal = 2000;
  const progress = (totalCalories / dailyGoal) * 100;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      
      try {
        const analysis = await geminiService.analyzeMealFromImage(base64String);
        
        setNewMeal({
          name: analysis.description || 'Analyzed Meal',
          calories: analysis.calories,
          protein: analysis.breakdown.protein,
          carbs: analysis.breakdown.carbs,
          fats: analysis.breakdown.fats,
        });
        setManualMode(true);
      } catch (error) {
        alert('Failed to analyze image. Please enter meal details manually.');
        setManualMode(true);
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddMeal = () => {
    if (!newMeal.name || newMeal.calories === 0) {
      alert('Please enter meal name and calories');
      return;
    }

    const meal = {
      id: meals.length + 1,
      name: newMeal.name,
      calories: newMeal.calories,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      protein: newMeal.protein,
      carbs: newMeal.carbs,
      fats: newMeal.fats,
    };

    setMeals([...meals, meal]);
    setShowAddModal(false);
    setNewMeal({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
    setManualMode(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => window.history.back()} className="p-2 rounded-full bg-gray-100">
          <FiChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Food & Calorie Tracking</h1>
        <button 
          onClick={() => setShowAddModal(true)}
          className="p-2 rounded-full bg-green-100"
        >
          <FiPlus size={24} className="text-green-600" />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800">Today's Progress</h2>
            <FiTrendingUp className="text-green-500" size={24} />
          </div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-3xl font-bold text-gray-800">{totalCalories}</span>
            <span className="text-sm text-gray-500">/ {dailyGoal} kcal</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <h3 className="font-semibold mb-3 text-gray-800">Nutrition Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{totalCarbs}g</p>
              <p className="text-xs text-gray-500">Carbs</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{totalProtein}g</p>
              <p className="text-xs text-gray-500">Protein</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{totalFats}g</p>
              <p className="text-xs text-gray-500">Fat</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold mb-3 text-gray-800">Today's Meals</h3>
          <div className="space-y-3">
            {meals.map((meal) => (
              <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{meal.name}</p>
                  <p className="text-xs text-gray-500">{meal.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{meal.calories}</p>
                  <p className="text-xs text-gray-500">kcal</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 bg-white border-t">
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full flex items-center justify-center p-4 text-white bg-green-500 rounded-lg"
        >
          <FiPlus size={22} className="mr-2" />
          <span>Log New Meal</span>
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Add Meal</h3>
            
            {!manualMode && !analyzing && (
              <div className="space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                >
                  <FiCamera size={20} /> Take/Upload Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  onClick={() => setManualMode(true)}
                  className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Enter Manually
                </button>
              </div>
            )}

            {analyzing && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Analyzing your meal...</p>
              </div>
            )}

            {manualMode && !analyzing && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Name</label>
                  <input
                    type="text"
                    value={newMeal.name}
                    onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Grilled Chicken"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                  <input
                    type="number"
                    value={newMeal.calories}
                    onChange={(e) => setNewMeal({ ...newMeal, calories: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                    <input
                      type="number"
                      value={newMeal.protein}
                      onChange={(e) => setNewMeal({ ...newMeal, protein: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                    <input
                      type="number"
                      value={newMeal.carbs}
                      onChange={(e) => setNewMeal({ ...newMeal, carbs: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fats (g)</label>
                    <input
                      type="number"
                      value={newMeal.fats}
                      onChange={(e) => setNewMeal({ ...newMeal, fats: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddMeal}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Add Meal
                  </button>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setManualMode(false);
                      setNewMeal({ name: '', calories: 0, protein: 0, carbs: 0, fats: 0 });
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodTracking;
