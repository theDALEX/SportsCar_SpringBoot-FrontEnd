
"use client";

import { useEffect, useState } from "react";
import { Search, X, ChevronDown, ChevronUp, Gauge, Sliders } from "lucide-react";

interface SportsCar {
  id: number;
  carMaker: string;
  carModel: string;
  year: number;
  engineSize: string;
  horsepower: string;
  torque: string;
  accelerationZeroSixty: string | null;
  priceUsd: string;
}

export default function SportsCar() {
  const [sportsCarPrices, setSportsCarPrices] = useState<SportsCar[]>([]);
  const [filteredCars, setFilteredCars] = useState<SportsCar[]>([]);
  const [showCarPrices, setShowCarPrices] = useState(false);
  const [searchYear, setSearchYear] = useState("");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedMaker, setSelectedMaker] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const pullInitialData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "https://sportscar-springboot-api.onrender.com/cars",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data: SportsCar[] = await response.json();
        console.log(data);
        setSportsCarPrices(data);
        setFilteredCars(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    pullInitialData();
  }, []);

  useEffect(() => {
    // Filter cars based on search year and selected maker
    let filtered = [...sportsCarPrices];
    
    if (searchYear.trim()) {
      filtered = filtered.filter(car => 
        car.year.toString().includes(searchYear.trim())
      );
    }
    
    if (selectedMaker) {
      filtered = filtered.filter(car => 
        car.carMaker === selectedMaker
      );
    }
    
    // Sort cars if a sort option is selected
    if (sortBy) {
      filtered.sort((a, b) => {
        let valueA: any;
        let valueB: any;
        
        switch (sortBy) {
          case 'year':
            valueA = a.year;
            valueB = b.year;
            break;
          default:
            return 0;
        }
        
        return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      });
    }
    
    setFilteredCars(filtered);
  }, [sportsCarPrices, searchYear, sortBy, sortDirection, selectedMaker]);

  const uniqueCarMakers = Array.from(
    new Set(sportsCarPrices.map(car => car.carMaker))
  ).sort();

  const handleSort = (criteria: string) => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(criteria);
      setSortDirection("asc");
    }
  };

  const clearFilters = () => {
    setSearchYear("");
    setSelectedMaker(null);
    setSortBy(null);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="absolute inset-0 bg-cover bg-center opacity-30 z-0" style={{ backgroundImage: 'url(/carbackground.webp)' }}></div>
      
      <div className="relative z-10">
        <header className="sticky top-0 backdrop-blur-lg bg-black/70 shadow-lg border-b border-red-800/30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-2">
                <Gauge className="text-red-500 w-8 h-8" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">Sports Car Hub</h1>
              </div>
              
              <div className="w-full md:w-1/2 relative">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={searchYear}
                    onChange={(e) => setSearchYear(e.target.value)}
                    placeholder="Search by year..."
                    className="w-full px-4 py-2 pl-10 bg-gray-800/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 text-gray-400 w-5 h-5" />
                  {searchYear && (
                    <button 
                      onClick={() => setSearchYear("")}
                      className="absolute right-3 text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4 items-center justify-center md:justify-start">
              <div className="relative">
                <select 
                  value={selectedMaker || ""}
                  onChange={(e) => setSelectedMaker(e.target.value || null)}
                  className="appearance-none px-4 py-2 bg-gray-800/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-8"
                >
                  <option value="">All Makers</option>
                  {uniqueCarMakers.map(maker => (
                    <option key={maker} value={maker}>{maker}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              
              <button 
                className={`px-4 py-2 flex items-center gap-2 rounded-lg border ${sortBy === 'year' ? 'bg-red-600/50 border-red-500' : 'bg-gray-800/70 border-gray-700'} transition-all`}
                onClick={() => handleSort('year')}
              >
                Year
                {sortBy === 'year' && (
                  sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                )}
              </button>
              
              {(searchYear || selectedMaker || sortBy) && (
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 flex items-center gap-2 text-sm bg-gray-700/40 hover:bg-gray-600/40 rounded-lg border border-gray-700"
                >
                  <X className="w-4 h-4" /> Clear Filters
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {!showCarPrices ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
              <h2 className="text-6xl font-extrabold drop-shadow-lg bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">Feel the Speed</h2>
              <p className="text-xl max-w-2xl text-gray-300">Discover the world's fastest sports cars with detailed specs, performance data, and pricing information.</p>

              <div className="flex gap-6 mt-8">
                <button 
                  className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 rounded-full hover:from-red-700 hover:to-red-900 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
                  onClick={() => setShowCarPrices(true)}
                >
                  <Gauge className="w-5 h-5" />
                  Explore All Cars
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">
                  {searchYear ? `Sports Cars from ${searchYear}` : "All Sports Cars"}
                  {selectedMaker ? ` by ${selectedMaker}` : ""}
                </h2>
                <button 
                  className="px-4 py-2 bg-gray-800 rounded-full hover:bg-gray-700 transition flex items-center gap-2"
                  onClick={() => setShowCarPrices(false)}
                >
                  <X className="w-4 h-4" />
                  Close
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                  <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredCars.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <div 
                      key={car.id} 
                      className="relative overflow-hidden group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl shadow-xl transition-all hover:shadow-red-500/10 hover:border-red-900/30"
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
                      <div className="h-40 bg-gray-800 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                          <Gauge className="w-12 h-12 text-red-500 opacity-30" />
                        </div>
                      </div>
                      <div className="p-6 relative z-20">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-sm text-red-500 font-medium">{car.carMaker}</span>
                            <h3 className="text-2xl font-bold">{car.carModel}</h3>
                          </div>
                          <span className="bg-red-800/30 text-red-300 px-2 py-1 rounded text-sm font-medium">{car.year}</span>
                        </div>
                        
                        <div className="mt-4 space-y-2 text-gray-300">
                          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                            <span>Engine</span>
                            <span className="font-semibold">{car.engineSize}L</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                            <span>Horsepower</span>
                            <span className="font-semibold">{car.horsepower} HP</span>
                          </div>
                          <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                            <span>Torque</span>
                            <span className="font-semibold">{car.torque} lb-ft</span>
                          </div>
                          {car.accelerationZeroSixty && (
                            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                              <span>0-60 mph</span>
                              <span className="font-semibold">{car.accelerationZeroSixty}s</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-6 flex justify-between items-center">
                          <div className="text-xl font-bold text-red-500">${car.priceUsd}</div>
                          <button className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 border border-red-800/30 rounded-full text-sm transition-all">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-900/50 rounded-xl border border-gray-800">
                  <h3 className="text-xl font-medium text-gray-300">No cars found matching your criteria</h3>
                  <p className="mt-2 text-gray-400">Try adjusting your search or filters</p>
                  <button 
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-red-700/30 hover:bg-red-700/50 border border-red-800/30 rounded-lg"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        <footer className="bg-black/80 border-t border-gray-800 py-6 mt-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <Gauge className="text-red-500 w-6 h-6" />
                <span className="text-xl font-bold">Sports Car Hub</span>
              </div>
              <p className="text-gray-400">© 2025 Sports Car Hub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}