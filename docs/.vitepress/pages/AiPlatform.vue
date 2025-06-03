<template>
  <div class="flex flex-col h-screen max-w-900px mx-auto bg-light-100 dark:bg-dark-800 rounded-lg shadow-lg overflow-hidden">
    <div class="flex-1 p-4 overflow-y-auto flex flex-col gap-4" ref="messageContainer">
      <!-- Welcome Section -->
      <div v-if="messages.length <= 1" class="w-full max-w-3xl mx-auto py-8">
        <!-- Chat Mode -->
        <Chat
          v-if="activeMode === 'chat'"
          :suggestions="chatSuggestions"
          @select-suggestion="selectSuggestion"
        />

        <!-- Research Mode -->
        <Research
          v-else-if="activeMode === 'research'"
          :tasks="researchTasks"
          @add-task="addResearchTask"
          @start-task="startResearchTask"
          @remove-task="removeResearchTask"
        />

        <!-- Image Mode -->
        <ImageMode
          v-else-if="activeMode === 'image'"
          @select-app="selectSuggestion"
        />

        <!-- Video Mode -->
        <VideoMode
          v-else-if="activeMode === 'video'"
          @select-app="selectSuggestion"
        />

        <!-- Shop Mode -->
        <Shop
          v-else-if="activeMode === 'shop'"
          @select-app="selectSuggestion"
        />

        <!-- Task Mode -->
        <Task
          v-else-if="activeMode === 'task'"
        />
      </div>
      <div v-for="(message, index) in messages" :key="message.id" :class="['flex mb-4 items-start', message.role === 'user' ? 'justify-end' : '']">
        <!-- AI Avatar with Hover Info -->
        <div class="w-10 h-10 rounded-full mr-3 flex-shrink-0 relative group" v-if="message.role !== 'user'">
          <img :src="message.model ? getAIAvatar(message.model) : botAvatar" alt="assistant" class="w-full h-full rounded-full object-cover">
          <!-- Hover Info Card for AI -->
          <div class="absolute left-0 bottom-full mb-2 w-60 bg-white dark:bg-dark-900 shadow-lg rounded-lg p-3 text-sm hidden group-hover:block z-10 transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
            <div class="flex items-center mb-2">
              <img :src="message.model ? getAIAvatar(message.model) : botAvatar" alt="model" class="w-8 h-8 rounded-full mr-2">
              <div>
                <div class="font-medium">{{ message.model ? getModelName(message.model) : 'AI Assistant' }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ message.model || 'Default Model' }}</div>
              </div>
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-300">
              AI language model designed to assist with various tasks including answering questions, writing content, and more.
            </div>
          </div>
        </div>

        <!-- Message Content -->
        <div :class="[
          'p-3 rounded-lg shadow-sm max-w-80%', 
          message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-dark-600'
        ]">
          <!-- Message Info (Model name and time) -->
          <div v-if="message.role === 'assistant' && message.model" class="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>{{ getModelName(message.model) }}</span>
            <span class="mx-1">•</span>
            <span>{{ formatTime(message.timestamp) }}</span>
          </div>

          <!-- User Content -->
          <div v-if="message.role === 'user'" class="whitespace-pre-wrap">{{ message.content }}</div>

          <!-- Assistant Content with Mode-specific Animation -->
          <div v-else-if="message.role === 'assistant' && message.streaming" 
               class="markdown-body relative">
            <!-- Typing Animation Effect -->
            <div v-html="renderMarkdown(message.content)" class="animate-fade-in"></div>
            
            <!-- Mode-specific typing indicators -->
            <div v-if="activeMode === 'chat'" class="flex items-center absolute -bottom-6 left-0">
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 animate-typing mx-0.5" style="animation-delay: 0ms"></span>
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 animate-typing mx-0.5" style="animation-delay: 200ms"></span>
              <span class="inline-block w-1.5 h-1.5 rounded-full bg-gray-400 animate-typing mx-0.5" style="animation-delay: 400ms"></span>
            </div>
            
            <div v-else-if="activeMode === 'research'" class="flex items-center absolute -bottom-6 left-0 bg-white/90 dark:bg-gray-800/90 px-2 py-0.5 rounded-full shadow-sm text-xs">
              <span class="i-mdi-magnify text-blue-500 animate-pulse mr-1"></span>
              <span class="text-gray-700 dark:text-gray-300">ค้นคว้าข้อมูล...</span>
            </div>
          </div>

          <!-- Assistant Normal Content by Mode -->
          <div v-else-if="message.role === 'assistant'" 
               :class="[
                 'markdown-body relative animate-fade-in',
                 activeMode === 'research' ? 'border-l-3 border-l-blue-500 pl-3' : ''
               ]"
               :style="{
                 '--animate-duration': activeMode === 'chat' ? '0.3s' : 
                                      activeMode === 'research' ? '0.6s' : '0.8s'
               }">
            <div v-if="activeMode === 'research' && !message.streaming" class="inline-flex items-center mb-2 text-xs text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30">
              <span class="i-mdi-magnify text-blue-500 dark:text-blue-300 mr-1"></span>
              <span>ผลการค้นคว้าจาก {{ getModelName(message.model || selectedModel) }}</span>
            </div>
            
            <div v-html="renderMarkdown(message.content)"></div>
          </div>

          <!-- Attached Files Display -->
          <div v-if="message.files && message.files.length > 0" class="mt-2 flex flex-wrap gap-2">
            <div v-for="file in message.files" :key="file.id" class="relative">
              <!-- Image Preview -->
              <div v-if="file.type === 'image'" class="max-w-40 max-h-40 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                <img :src="file.preview || file.url" :alt="file.name" class="w-full h-full object-cover" />
              </div>

              <!-- Video Preview -->
              <div v-else-if="file.type === 'video'" class="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-dark-800 flex items-center justify-center">
                <div class="i-mdi-video text-3xl text-gray-500 dark:text-gray-400"></div>
                <span class="text-xs mt-1 text-center block">{{ file.name }}</span>
              </div>

              <!-- File Preview -->
              <div v-else class="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-dark-800 flex flex-col items-center justify-center p-1">
                <div class="i-mdi-file-document text-3xl text-gray-500 dark:text-gray-400"></div>
                <span class="text-xs mt-1 text-center block truncate w-full">{{ file.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- User Avatar with Hover Info -->
        <div class="w-10 h-10 rounded-full ml-3 flex-shrink-0 relative group" v-if="message.role === 'user'">
          <img :src="userAvatar" alt="user" class="w-full h-full rounded-full object-cover">
          <!-- Hover Info Card for User -->
          <div class="absolute right-0 bottom-full mb-2 w-60 bg-white dark:bg-dark-900 shadow-lg rounded-lg p-3 text-sm hidden group-hover:block z-10 transform translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
            <div class="flex items-center mb-2">
              <img :src="userAvatar" alt="user" class="w-8 h-8 rounded-full mr-2">
              <div>
                <div class="font-medium">You</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">User</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Indicator (only shown when not streaming) -->
      <div v-if="isLoading && !isStreaming" class="flex mb-4 items-start">
        <div class="w-10 h-10 rounded-full mr-3 flex-shrink-0 relative">
          <img :src="getAIAvatar(selectedModel)" alt="assistant" class="w-full h-full rounded-full object-cover">
        </div>
        <div class="p-3 rounded-lg shadow-sm bg-gray-100 dark:bg-dark-600">
          <div class="flex items-center">
            <span class="h-2 w-2 bg-gray-400 rounded-full inline-block mr-1 animate-bounce"></span>
            <span class="h-2 w-2 bg-gray-400 rounded-full inline-block mr-1 animate-bounce animation-delay-200"></span>
            <span class="h-2 w-2 bg-gray-400 rounded-full inline-block animate-bounce animation-delay-400"></span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="flex flex-col p-4 bg-white dark:bg-dark-700 border-t border-gray-200 dark:border-dark-600">
      <!-- File Upload Preview -->
      <div v-if="pendingFiles.length > 0" class="mb-3 flex flex-wrap gap-2">
        <div v-for="(file, index) in pendingFiles" :key="file.id" class="relative">
          <!-- Image Preview -->
          <div v-if="file.type === 'image'" class="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            <img :src="file.preview || file.url" :alt="file.name" class="w-full h-full object-cover" />
          </div>

          <!-- Video Preview -->
          <div v-else-if="file.type === 'video'" class="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-dark-800 flex items-center justify-center">
            <div class="i-mdi-video text-3xl text-gray-500 dark:text-gray-400"></div>
          </div>

          <!-- File Preview -->
          <div v-else class="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-dark-800 flex items-center justify-center">
            <div class="i-mdi-file-document text-3xl text-gray-500 dark:text-gray-400"></div>
          </div>

          <!-- Remove Button -->
          <button 
            @click="removeFile(index)" 
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-red-600"
          >
            <div class="i-mdi-close text-xs"></div>
          </button>
        </div>
      </div>

      <!-- Input Row 1: Text Input -->
      <div class="flex mb-2">
        <textarea 
          v-model="userInput" 
          @keydown.enter.prevent="handleEnterKey"
          @paste="handlePaste"
          :placeholder="getPlaceholderText()"
          rows="3"
          :style="{ fontSize: `${inputFontSize}px` }"
          class="flex-1 border border-gray-200 dark:border-dark-500 rounded-xl px-4 py-2.5 resize-none dark:bg-dark-800 dark:text-white transition-all duration-200"
          ref="textareaRef"
        ></textarea>
      </div>

      <!-- Input Row 2: Controls -->
      <div class="flex items-center justify-between">
        <!-- Left Side: Upload Buttons and Input Settings -->
        <div class="flex items-center gap-2">
          <!-- Input Settings Button -->
          <div class="relative">
            <button 
              @click="showInputSettings = !showInputSettings"
              class="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700"
              title="Input Settings"
            >
              <div class="i-mdi-text-box-edit text-base"></div>
            </button>

            <!-- Input Settings Popover -->
            <div v-if="showInputSettings" class="absolute left-0 bottom-full mb-2 w-72 bg-white dark:bg-dark-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-3 z-20">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-medium text-sm">ตั้งค่าการป้อนข้อมูล</h3>
                <button @click="showInputSettings = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <div class="i-mdi-close text-lg"></div>
                </button>
              </div>
              
              <!-- Language Selection -->
              <div class="mb-3">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">ภาษา</label>
                <select 
                  v-model="inputLanguage" 
                  class="w-full text-sm border border-gray-200 dark:border-dark-600 rounded px-3 py-1.5 bg-white dark:bg-dark-800 text-gray-800 dark:text-white"
                >
                  <option value="th">ไทย</option>
                  <option value="en">English</option>
                  <option value="zh">中文</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                </select>
              </div>
              
              <!-- Input Style -->
              <div class="mb-3">
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">สไตล์การป้อนข้อมูล</label>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    @click="inputStyle = 'casual'" 
                    :class="[
                      'text-xs p-2 rounded-md flex items-center justify-center',
                      inputStyle === 'casual' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700' : 'bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-600'
                    ]"
                  >
                    <span class="i-mdi-chat mr-1"></span>
                    <span>ทั่วไป</span>
                  </button>
                  <button 
                    @click="inputStyle = 'formal'" 
                    :class="[
                      'text-xs p-2 rounded-md flex items-center justify-center',
                      inputStyle === 'formal' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700' : 'bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-600'
                    ]"
                  >
                    <span class="i-mdi-book mr-1"></span>
                    <span>ทางการ</span>
                  </button>
                  <button 
                    @click="inputStyle = 'technical'" 
                    :class="[
                      'text-xs p-2 rounded-md flex items-center justify-center',
                      inputStyle === 'technical' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700' : 'bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-600'
                    ]"
                  >
                    <span class="i-mdi-code-tags mr-1"></span>
                    <span>เทคนิค</span>
                  </button>
                  <button 
                    @click="inputStyle = 'creative'" 
                    :class="[
                      'text-xs p-2 rounded-md flex items-center justify-center',
                      inputStyle === 'creative' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 border border-blue-300 dark:border-blue-700' : 'bg-gray-100 dark:bg-dark-700 border border-gray-200 dark:border-dark-600'
                    ]"
                  >
                    <span class="i-mdi-palette mr-1"></span>
                    <span>สร้างสรรค์</span>
                  </button>
                </div>
              </div>
              
              <!-- Font Size -->
              <div>
                <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">ขนาดตัวอักษร</label>
                <div class="flex items-center">
                  <span class="i-mdi-format-font-size-decrease text-lg text-gray-500 dark:text-gray-400"></span>
                  <input 
                    v-model="inputFontSize" 
                    type="range" 
                    min="12" 
                    max="20" 
                    step="1"
                    class="mx-2 flex-1"
                  />
                  <span class="i-mdi-format-font-size-increase text-lg text-gray-500 dark:text-gray-400"></span>
                </div>
              </div>
            </div>
          </div>
          <!-- Upload Buttons -->
          <button 
            @click="initiateUpload('image')" 
            class="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700"
            title="Upload Image"
          >
            <div class="i-mdi-image text-base"></div>
          </button>

          <button 
            @click="initiateUpload('video')" 
            class="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700"
            title="Upload Video"
          >
            <div class="i-mdi-video text-base"></div>
          </button>

          <button 
            @click="initiateUpload('file')" 
            class="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700"
            title="Upload File"
          >
            <div class="i-mdi-file-document text-base"></div>
          </button>

          <!-- Hidden File Input -->
          <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            :accept="getAcceptTypes()" 
            @change="handleFileInput"
          />
        </div>

        <!-- Center: Mode Selector -->
        <div class="flex items-center gap-1 overflow-x-auto pb-1">
          <button 
            @click="activeMode = 'chat'; updateInstructionsForMode('chat')"
            :class="[
              'flex items-center px-2 py-1 text-xs rounded-md whitespace-nowrap', 
              activeMode === 'chat' ? 'bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
            ]"
            title="Chat Mode"
          >
            <div class="i-mdi-chat-outline text-base mr-1"></div>
            <span>Chat</span>
          </button>

          <button 
            @click="activeMode = 'research'; updateInstructionsForMode('research')"
            :class="[
              'flex items-center px-2 py-1 text-xs rounded-md whitespace-nowrap', 
              activeMode === 'research' ? 'bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
            ]"
            title="Research Mode"
          >
            <div class="i-mdi-magnify text-base mr-1"></div>
            <span>Research</span>
          </button>

          <button 
            @click="activeMode = 'image'; updateInstructionsForMode('image')"
            :class="[
              'flex items-center px-2 py-1 text-xs rounded-md whitespace-nowrap', 
              activeMode === 'image' ? 'bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
            ]"
            title="Image Mode"
          >
            <div class="i-mdi-image-edit-outline text-base mr-1"></div>
            <span>Image</span>
          </button>

          <button 
            @click="activeMode = 'video'; updateInstructionsForMode('video')"
            :class="[
              'flex items-center px-2 py-1 text-xs rounded-md whitespace-nowrap', 
              activeMode === 'video' ? 'bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
            ]"
            title="Video Mode"
          >
            <div class="i-mdi-video-outline text-base mr-1"></div>
            <span>Video</span>
          </button>

          <button 
            @click="activeMode = 'shop'; updateInstructionsForMode('shop')"
            :class="[
              'flex items-center px-2 py-1 text-xs rounded-md whitespace-nowrap', 
              activeMode === 'shop' ? 'bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
            ]"
            title="Shop Mode"
          >
            <div class="i-mdi-shopping text-base mr-1"></div>
            <span>Shop</span>
          </button>

          <!-- Task Mode Button -->
          <button 
            @click="activeMode = 'task'; updateInstructionsForMode('task')"
            :class="[
              'flex items-center px-2 py-1 text-xs rounded-md whitespace-nowrap', 
              activeMode === 'task' ? 'bg-gray-200 dark:bg-dark-600 text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-800'
            ]"
            title="Task Management"
          >
            <div class="i-mdi-format-list-checks text-base mr-1"></div>
            <span>Task</span>
          </button>
        </div>

        <!-- Right Side: Models and Send -->
        <div class="flex items-center gap-2">
          <!-- Custom Instructions -->
          <div class="relative">
            <button 
              @click="showInstructions = !showInstructions"
              class="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700"
              title="Instructions"
            >
              <div class="i-mdi-tune text-base"></div>
            </button>

            <!-- Instructions Popover -->
            <div v-if="showInstructions" class="absolute right-0 bottom-full mb-2 w-80 bg-white dark:bg-dark-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-3 z-20">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-medium text-sm">Custom Instructions</h3>
                <button @click="showInstructions = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <div class="i-mdi-close text-lg"></div>
                </button>
              </div>
              
              <textarea
                v-model="customInstructions"
                placeholder="Add custom instructions for the AI..."
                rows="3"
                class="w-full text-sm border border-gray-200 dark:border-dark-600 rounded px-3 py-2 bg-white dark:bg-dark-800 text-gray-800 dark:text-white resize-none mb-2"
              ></textarea>
              
              <!-- Presets -->
              <div class="mb-2">
                <div class="flex justify-between items-center mb-1">
                  <div class="text-xs font-medium text-gray-700 dark:text-gray-300">Presets</div>
                  <button 
                    @click="saveInstructionPreset"
                    class="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-500"
                    title="Save Current as Preset"
                  >
                    Save Current
                  </button>
                </div>
                <div class="flex flex-wrap gap-1">
                  <button 
                    v-for="preset in instructionPresetsList" 
                    :key="preset.id"
                    @click="applyPreset(preset)"
                    class="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-dark-800 hover:bg-gray-200 dark:hover:bg-dark-700 truncate max-w-[120px]"
                  >
                    {{ preset.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Model Selector -->
          <div class="relative">
            <button 
              @click="showModelSelector = !showModelSelector"
              class="flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-700"
              title="Select Model"
            >
              <div class="i-mdi-robot text-base"></div>
            </button>

            <!-- Model Selector Popover -->
            <div v-if="showModelSelector" class="absolute right-0 bottom-full mb-2 w-60 bg-white dark:bg-dark-900 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 p-2 z-20">
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-medium text-sm">Select Model</h3>
                <button @click="showModelSelector = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                  <div class="i-mdi-close text-lg"></div>
                </button>
              </div>

              <div class="flex flex-col gap-1 max-h-60 overflow-y-auto">
                <button 
                  v-for="model in availableModels" 
                  :key="model.id"
                  @click="changeModel(model.id)"
                  :class="[
                    'flex items-center py-2 px-3 rounded text-sm',
                    selectedModel === model.id ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300' : 'hover:bg-gray-100 dark:hover:bg-dark-800'
                  ]"
                >
                  <img :src="model.icon" :alt="model.name" class="w-6 h-6 rounded-full mr-2">
                  <span>{{ model.name }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Send Button -->
          <button 
            :disabled="(!userInput.trim() && pendingFiles.length === 0) || isLoading" 
            @click="sendMessage"
            class="w-10 h-10 rounded-full bg-gray-700 dark:bg-blue-600 text-white border-none cursor-pointer flex items-center justify-center transition-colors hover:bg-gray-800 dark:hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            <div class="i-mdi-send text-lg"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MarkdownIt from "markdown-it";
import { type Highlighter, createHighlighter } from "shiki";
import { nextTick, onMounted, ref, watch } from "vue";
import Chat from "../components/aiplatform/modeui/Chat.vue";
import ImageMode from "../components/aiplatform/modeui/Image.vue";
import Research from "../components/aiplatform/modeui/Research.vue";
import Shop from "../components/aiplatform/modeui/Shop.vue";
import Task from "../components/aiplatform/modeui/Task.vue";
import VideoMode from "../components/aiplatform/modeui/Video.vue";

// Type for environment variables
interface ViteEnv {
	VITE_OPENAI_API_KEY?: string;
	// Add other environment variables here if needed
}

interface Message {
	id: string;
	role: "user" | "assistant";
	content: string;
	timestamp: number;
	model?: string;
	files?: FileAttachment[];
	streaming?: boolean;
}

interface FileAttachment {
	id: string;
	type: "image" | "video" | "file";
	name: string;
	url: string;
	size?: number;
	preview?: string;
}

const userInput = ref("");
const messages = ref<Message[]>([
	{
		id: crypto.randomUUID(),
		role: "assistant",
		content: "สวัสดีครับ! มีอะไรให้ช่วยไหมครับ?",
		timestamp: Date.now(),
		model: "gpt-4",
	},
]);
const isLoading = ref(false);
const messageContainer = ref<HTMLElement | null>(null);
const userAvatar =
	"https://scontent.fhdy1-1.fna.fbcdn.net/v/t39.30808-6/440967283_1559796247915433_1502119988520930020_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=mP1qKpTBxowQ7kNvwGBtK5x&_nc_oc=AdmeoLmYK4cePxSwItkfDR-b5QwDvn-WgLg1xNUdvVlwJxNtsGJ9t6_iQJItngxzmE0&_nc_zt=23&_nc_ht=scontent.fhdy1-1.fna&_nc_gid=4cUCrhfFmqvdOiho-ujlFg&oh=00_AfIUf4VFMIghlMamlLGcmyPfBP0oeDymECC_XV4HTD7NDw&oe=682AA466";
const botAvatar = "/images/bot-avatar.png";

// Models configuration
const availableModels = [
	{
		id: "gpt-3.5-turbo",
		name: "GPT-3.5 Turbo",
		icon: "https://openai.com/favicon.ico",
	},
	{ id: "gpt-4", name: "GPT-4", icon: "https://openai.com/favicon.ico" },
	{ id: "claude-3", name: "Claude 3", icon: "/images/claude-avatar.png" },
	{ id: "gemini-pro", name: "Gemini Pro", icon: "/images/gemini-avatar.png" },
];

// User settings with local storage persistence
const selectedModel = ref(localStorage.getItem("selectedModel") || "gpt-4");
const customInstructions = ref(
	localStorage.getItem("customInstructions") || "",
);

// Watch for changes to save in localStorage
watch(selectedModel, (newValue) => {
	localStorage.setItem("selectedModel", newValue);
});

watch(customInstructions, (newValue) => {
	localStorage.setItem("customInstructions", newValue);
});

// เพิ่ม expose เพื่อให้ template สามารถเข้าถึงฟังก์ชัน/ตัวแปรได้

// File upload variables
const fileInput = ref<HTMLInputElement | null>(null);
const uploadType = ref<"image" | "video" | "file">("image");
const pendingFiles = ref<FileAttachment[]>([]);

// Streaming state
const isStreaming = ref(false);
const streamingMessage = ref<Message | null>(null);

// Initialize markdown-it
const md = new MarkdownIt({
	html: true,
	linkify: true,
	typographer: true,
});

// Initialize shiki highlighter
const initHighlighter = async () => {
	try {
		const highlighter = await createHighlighter({
			themes: ["github-light"],
			langs: [
				"javascript",
				"typescript",
				"html",
				"css",
				"vue",
				"json",
				"bash",
				"markdown",
			],
		});

		// Override the highlight function in markdown-it
		md.options.highlight = (code, lang) => {
			try {
				return highlighter.codeToHtml(code, { lang, theme: "github-light" });
			} catch (error) {
				console.error("Syntax highlighting error:", error);
				return `<pre><code>${md.utils.escapeHtml(code)}</code></pre>`;
			}
		};

		return highlighter;
	} catch (error) {
		console.error("Failed to initialize highlighter:", error);
		return null;
	}
};

// Initialize highlighter when component mounts
const highlighter = ref<Highlighter | null>(null);
onMounted(async () => {
	const h = await initHighlighter();
	highlighter.value = h;

	// Load saved messages if any
	const savedMessages = localStorage.getItem("chat_messages");
	if (savedMessages) {
		messages.value = JSON.parse(savedMessages);
	}

	// Load saved research tasks
	const savedTasks = localStorage.getItem("research_tasks");
	if (savedTasks) {
		researchTasks.value = JSON.parse(savedTasks);
	}
});

// OpenAI service implementation
class OpenAIService {
	private apiKey: string | null = null;
	private baseUrl = "https://api.openai.com/v1";

	constructor() {
		// ตรวจสอบว่ามี API key ใน environment variables หรือไม่
		const getEnvKey = (): string | null => {
			try {
				// @ts-ignore - Vite environment variables
				const env: ViteEnv = import.meta.env || {};
				const envKey = env.VITE_OPENAI_API_KEY;

				if (envKey) return String(envKey);

				// หรือดึงจาก localStorage ถ้าไม่มีใน env
				if (typeof window !== "undefined") {
					const storedKey = localStorage.getItem("openai_api_key");
					return storedKey ? String(storedKey) : null;
				}
			} catch (e) {
				console.error("Error accessing environment variables:", e);
			}
			return null;
		};

		this.apiKey = getEnvKey();
	}

	// ตั้งค่า API key
	setApiKey(apiKey: string) {
		this.apiKey = apiKey;
		if (typeof window !== "undefined") {
			localStorage.setItem("openai_api_key", apiKey);
		}
	}

	// ตรวจสอบว่ามี API key หรือไม่
	hasApiKey(): boolean {
		return !!this.apiKey;
	}

	// Normal send message function (not streaming)
	async sendMessage(messages: Message[]): Promise<string> {
		try {
			if (!this.apiKey) {
				throw new Error("OpenAI API key is not set");
			}

			const response = await fetch(`${this.baseUrl}/chat/completions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					model: selectedModel.value,
					messages: this.formatMessages(messages),
					temperature: 0.7,
					max_tokens: 2000,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.error?.message || "Failed to fetch from OpenAI API",
				);
			}

			const data = await response.json();
			return data.choices[0]?.message?.content || "ไม่ได้รับคำตอบจาก AI";
		} catch (error) {
			console.error("OpenAI API error:", error);
			throw error;
		}
	}

	// Helper method for model name
	getModelName(modelId: string): string {
		const model = availableModels.find((m) => m.id === modelId);
		return model?.name || modelId;
	}

	// Stream message response
	async streamMessage(
		messages: Message[],
		onChunk: (chunk: string) => void,
	): Promise<string> {
		try {
			if (!this.apiKey) {
				throw new Error("OpenAI API key is not set");
			}

			const response = await fetch(`${this.baseUrl}/chat/completions`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					model: selectedModel.value,
					messages: this.formatMessages(messages),
					temperature: 0.7,
					max_tokens: 2000,
					stream: true,
				}),
			});

			if (!response.body) {
				throw new Error("No response body");
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder("utf-8");
			let buffer = "";
			let result = "";

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				buffer += decoder.decode(value, { stream: true });

				// Process each line in the buffer (pure function)
				const processStreamBuffer = (
					currentBuffer: string,
					currentResult: string,
					onData: (chunk: string) => void,
				): { buffer: string; result: string } => {
					const lineEndIndex = currentBuffer.indexOf("\n");
					if (lineEndIndex === -1)
						return { buffer: currentBuffer, result: currentResult };

					const line = currentBuffer.slice(0, lineEndIndex).trim();
					const remainingBuffer = currentBuffer.slice(lineEndIndex + 1);

					if (line.startsWith("data: ") && !line.includes("[DONE]")) {
						try {
							const data = JSON.parse(line.slice(6));
							const content = data.choices[0]?.delta?.content || "";
							if (content) {
								onData(content);
								return processStreamBuffer(
									remainingBuffer,
									currentResult + content,
									onData,
								);
							}
						} catch (e) {
							console.error("Error parsing stream data:", e);
						}
					}

					return processStreamBuffer(remainingBuffer, currentResult, onData);
				};

				// Process the buffer and update state
				const { buffer: newBuffer, result: newResult } = processStreamBuffer(
					buffer,
					result,
					onChunk,
				);
				buffer = newBuffer;
				result = newResult;
			}

			return result;
		} catch (error) {
			console.error("OpenAI streaming error:", error);
			throw error;
		}
	}

	// Helper to format messages and include files
	private formatMessages(messages: Message[]) {
		interface FormattedMessage {
			role: "system" | "user" | "assistant";
			content: string;
		}

		return messages.map((msg) => {
			let content = msg.content;

			// เพิ่มข้อมูลไฟล์ในเนื้อหาข้อความ
			if (msg.files && msg.files.length > 0) {
				const fileInfo = msg.files
					.map((file) => `[ไฟล์แนบ: ${file.name} (${file.type})]`)
					.join("\n");
				content = `${fileInfo}\n\n${content}`;
			}

			return {
				role: msg.role as "user" | "assistant" | "system",
				content: content,
			};
		});
	}
}

// UI State variables
const showInstructions = ref(false);
const showModelSelector = ref(false);
const showUploadOptions = ref(false);

// Chat suggestions
const chatSuggestions = [
	{
		title: "ช่วยเขียนอีเมล",
		description: "ช่วยเขียนอีเมลธุรกิจที่ดูเป็นมืออาชีพ",
		prompt: "ช่วยเขียนอีเมลถึงลูกค้าเกี่ยวกับการประชุมในวันพรุ่งนี้",
	},
	{
		title: "สรุปบทความ",
		description: "สรุปบทความหรือเอกสารให้กระชับ",
		prompt: "ช่วยสรุปบทความนี้ให้กระชับใน 3 ประเด็นหลัก",
	},
	{
		title: "เขียนโค้ด",
		description: "ช่วยเขียนโค้ดตามความต้องการ",
		prompt: "ช่วยเขียนฟังก์ชัน JavaScript สำหรับการ validate อีเมล",
	},
	{
		title: "ให้คำแนะนำ",
		description: "ขอคำแนะนำเกี่ยวกับหัวข้อที่สนใจ",
		prompt: "แนะนำวิธีการเริ่มต้นเรียนรู้การเขียนโปรแกรมสำหรับมือใหม่",
	},
];

// Research mode state
interface ResearchTask {
	id: string;
	title: string;
	status: "pending" | "in-progress" | "completed";
	result?: string;
}

const researchTasks = ref<ResearchTask[]>([]);
const newTaskTitle = ref("");
const showTaskInput = ref(false);
const showInputSettings = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const activeMode = ref<
	"chat" | "research" | "image" | "video" | "shop" | "task"
>("chat");

// Input customization variables
const inputLanguage = ref<string>(
	localStorage.getItem("inputLanguage") || "th",
);
const inputStyle = ref<"casual" | "formal" | "technical" | "creative">(
	(localStorage.getItem("inputStyle") as
		| "casual"
		| "formal"
		| "technical"
		| "creative") || "casual",
);
const inputFontSize = ref<number>(
	Number(localStorage.getItem("inputFontSize")) || 14,
);

// Watch for input customization changes to save in localStorage
watch(inputLanguage, (newValue) => {
	localStorage.setItem("inputLanguage", newValue);
});

watch(inputStyle, (newValue) => {
	localStorage.setItem("inputStyle", newValue);
});

watch(inputFontSize, (newValue) => {
	localStorage.setItem("inputFontSize", String(newValue));
});

// Instructions presets
interface InstructionPreset {
	id: string;
	name: string;
	content: string;
}

const instructionPresetsList = ref<InstructionPreset[]>(
	JSON.parse(localStorage.getItem("instructionPresets") || "[]"),
);

// ฟังก์ชันตั้งค่าตาม mode
const updateInstructionsForMode = (
	mode: "chat" | "research" | "image" | "video" | "shop" | "task",
) => {
	switch (mode) {
		case "research":
			// เพิ่มคำแนะนำสำหรับโหมด research
			customInstructions.value =
				"ฉันต้องการให้คุณช่วยค้นคว้าข้อมูลโดยละเอียด พร้อมให้แหล่งอ้างอิงที่น่าเชื่อถือ";
			break;
		case "image":
			customInstructions.value = "ฉันต้องการให้คุณช่วยสร้างหรือแก้ไขรูปภาพตามที่ฉันต้องการ";
			break;
		case "video":
			customInstructions.value = "ฉันต้องการให้คุณช่วยสร้างหรือแก้ไขวิดีโอตามที่ฉันต้องการ";
			break;
		case "shop":
			customInstructions.value = "ฉันต้องการให้คุณช่วยค้นหาสินค้าหรือบริการที่ฉันต้องการ";
			break;
		case "task":
			customInstructions.value = "ฉันต้องการให้คุณช่วยจัดการงานและติดตามความคืบหน้า";
			break;
		default:
			// กลับไปเป็นโหมดแชทปกติ
			customInstructions.value =
				localStorage.getItem("customInstructions") || "";
			break;
	}
};

// Instruction preset functions
const saveInstructionPreset = () => {
	if (!customInstructions.value.trim()) return;

	// ถามชื่อของ preset
	const presetName = prompt(
		"ตั้งชื่อสำหรับ preset นี้:",
		`Preset ${instructionPresetsList.value.length + 1}`,
	);
	if (!presetName) return;

	const newPreset: InstructionPreset = {
		id: crypto.randomUUID(),
		name: presetName,
		content: customInstructions.value,
	};

	instructionPresetsList.value.push(newPreset);
	savePresetsList();
};

const applyPreset = (preset: InstructionPreset) => {
	customInstructions.value = preset.content;
	localStorage.setItem("customInstructions", preset.content);
	showInstructions.value = false;
};

const savePresetsList = () => {
	localStorage.setItem(
		"instructionPresets",
		JSON.stringify(instructionPresetsList.value),
	);
};

// Model selection
const changeModel = (modelId: string) => {
	selectedModel.value = modelId;
	localStorage.setItem("selectedModel", modelId);
	showModelSelector.value = false;
};

// File handling functions
const getAcceptTypes = () => {
	switch (uploadType.value) {
		case "image":
			return "image/*";
		case "video":
			return "video/*";
		case "file":
			return "*/*";
		default:
			return "";
	}
};

const initiateUpload = (type: "image" | "video" | "file") => {
	uploadType.value = type;
	showUploadOptions.value = false;

	// Trigger file input click
	if (fileInput.value) {
		fileInput.value.click();
	}
};

const handleFileInput = (event: Event) => {
	const target = event.target as HTMLInputElement;

	if (target.files && target.files.length > 0) {
		const file = target.files[0];
		const fileId = crypto.randomUUID();
		const fileUrl = URL.createObjectURL(file);

		const fileAttachment: FileAttachment = {
			id: fileId,
			type: uploadType.value,
			name: file.name,
			url: fileUrl,
			size: file.size,
			preview: uploadType.value === "image" ? fileUrl : undefined,
		};

		pendingFiles.value.push(fileAttachment);

		// Reset the input
		target.value = "";
	}
};

const removeFile = (index: number) => {
	const file = pendingFiles.value[index];

	// Revoke object URL to prevent memory leaks
	if (file.url.startsWith("blob:")) {
		URL.revokeObjectURL(file.url);
	}

	pendingFiles.value.splice(index, 1);
};

const handlePaste = async (event: ClipboardEvent) => {
	if (!event.clipboardData) return;

	// Check for images
	const items = event.clipboardData.items;
	for (const item of items) {
		if (item.type.startsWith("image/")) {
			event.preventDefault(); // Prevent default paste of image as string

			const file = item.getAsFile();
			if (!file) continue;

			const fileId = crypto.randomUUID();
			const fileUrl = URL.createObjectURL(file);

			const fileAttachment: FileAttachment = {
				id: fileId,
				type: "image",
				name: `Pasted Image ${new Date().toLocaleTimeString()}`,
				url: fileUrl,
				size: file.size,
				preview: fileUrl,
			};

			pendingFiles.value.push(fileAttachment);
			break; // Only handle the first image
		}
	}
};

// Initialize OpenAI service
const openAIService = new OpenAIService();

// Helper functions
const renderMarkdown = (content: string): string => {
	return md.render(content);
};

const getAIAvatar = (modelId?: string): string => {
	if (!modelId) return botAvatar;

	const model = availableModels.find((m) => m.id === modelId);
	return model?.icon || botAvatar;
};

const getModelName = (modelId: string): string => {
	const model = availableModels.find((m) => m.id === modelId);
	return model?.name || modelId;
};

const getPlaceholderText = (): string => {
	// เริ่มด้วยการเลือกข้อความตามภาษา
	const basePlaceholders: Record<string, string> = {
		th: "คุณอยากรู้อะไร?",
		en: "What do you want to know?",
		zh: "你想了解什么?",
		ja: "何を知りたいですか?",
		ko: "무엇을 알고 싶으세요?",
	};

	// เลือกข้อความพื้นฐานตามภาษาที่เลือก
	let placeholder =
		basePlaceholders[inputLanguage.value] || basePlaceholders.th;

	// ปรับข้อความตาม mode และ style
	if (activeMode.value === "research") {
		const researchPhrases: Record<string, Record<string, string>> = {
			th: {
				casual: "อยากให้ช่วยค้นคว้าอะไร?",
				formal: "โปรดระบุหัวข้อที่ต้องการให้สืบค้นข้อมูล",
				technical: "โปรดระบุคำค้นหาหรือ keywords",
				creative: "มีเรื่องอะไรที่อยากรู้ลึกๆ?",
			},
			en: {
				casual: "What would you like me to research?",
				formal: "Please specify the topic for research",
				technical: "Enter search terms or keywords",
				creative: "What fascinating topic should we explore?",
			},
		};

		const langPhrases =
			researchPhrases[inputLanguage.value] || researchPhrases.th;
		placeholder = langPhrases[inputStyle.value] || langPhrases.casual;
	} else if (activeMode.value === "image") {
		// Image mode
		const imagePhrases: Record<string, Record<string, string>> = {
			th: {
				casual: "อยากให้สร้างหรือแก้ไขรูปภาพอะไรดี?",
				formal: "โปรดระบุรายละเอียดรูปภาพที่ต้องการ",
				technical: "ระบุรายละเอียดทางเทคนิคของรูปภาพ",
				creative: "มาสร้างรูปภาพสุดสร้างสรรค์กัน!",
			},
			en: {
				casual: "What kind of image would you like to create or edit?",
				formal: "Please specify the image details",
				technical: "Specify the technical details of the image",
				creative: "Let's create something amazing!",
			},
		};

		const langPhrases = imagePhrases[inputLanguage.value] || imagePhrases.th;
		placeholder = langPhrases[inputStyle.value] || langPhrases.casual;
	} else if (activeMode.value === "video") {
		// Video mode
		const videoPhrases: Record<string, Record<string, string>> = {
			th: {
				casual: "อยากให้สร้างหรือแก้ไขวิดีโออะไรดี?",
				formal: "โปรดระบุรายละเอียดวิดีโอที่ต้องการ",
				technical: "ระบุรายละเอียดทางเทคนิคของวิดีโอ",
				creative: "มาสร้างวิดีโอสุดเจ๋งกัน!",
			},
			en: {
				casual: "What kind of video would you like to create or edit?",
				formal: "Please specify the video details",
				technical: "Specify the technical details of the video",
				creative: "Let's create an amazing video!",
			},
		};

		const langPhrases = videoPhrases[inputLanguage.value] || videoPhrases.th;
		placeholder = langPhrases[inputStyle.value] || langPhrases.casual;
	} else if (activeMode.value === "shop") {
		// Shop mode
		const shopPhrases: Record<string, Record<string, string>> = {
			th: {
				casual: "หาสินค้าหรือบริการอะไรดี?",
				formal: "โปรดระบุสินค้าหรือบริการที่ต้องการค้นหา",
				technical: "ระบุรายละเอียดสินค้าหรือบริการ",
				creative: "ค้นหาสิ่งที่คุณต้องการได้ที่นี่!",
			},
			en: {
				casual: "What are you looking for?",
				formal: "Please specify the product or service",
				technical: "Specify the product or service details",
				creative: "Find what you need here!",
			},
		};

		const langPhrases = shopPhrases[inputLanguage.value] || shopPhrases.th;
		placeholder = langPhrases[inputStyle.value] || langPhrases.casual;
	} else {
		// Chat mode
		const chatPhrases: Record<string, Record<string, string>> = {
			th: {
				casual: "คุณอยากคุยเรื่องอะไร?",
				formal: "โปรดระบุคำถามหรือหัวข้อที่ต้องการสนทนา",
				technical: "มีคำถามเชิงเทคนิคอะไรไหม?",
				creative: "อยากให้ช่วยสร้างสรรค์อะไรดี?",
			},
			en: {
				casual: "What would you like to talk about?",
				formal: "Please state your question or conversation topic",
				technical: "Do you have any technical questions?",
				creative: "What would you like me to create?",
			},
		};

		const langPhrases = chatPhrases[inputLanguage.value] || chatPhrases.th;
		placeholder = langPhrases[inputStyle.value] || langPhrases.casual;
	}

	return placeholder;
};

// Research task functions
const addResearchTask = () => {
	if (!newTaskTitle.value.trim()) return;

	const newTask: ResearchTask = {
		id: crypto.randomUUID(),
		title: newTaskTitle.value.trim(),
		status: "pending",
	};

	researchTasks.value.push(newTask);
	newTaskTitle.value = "";
	showTaskInput.value = false;
	saveResearchTasks();
};

const startResearchTask = (taskId: string) => {
	const task = researchTasks.value.find((t) => t.id === taskId);
	if (task) {
		task.status = "in-progress";
		saveResearchTasks();
	}
};

const completeResearchTask = (taskId: string, result: string) => {
	const task = researchTasks.value.find((t) => t.id === taskId);
	if (task) {
		task.status = "completed";
		task.result = result;
		saveResearchTasks();
	}
};

const removeResearchTask = (taskId: string) => {
	researchTasks.value = researchTasks.value.filter((t) => t.id !== taskId);
	saveResearchTasks();
};

const saveResearchTasks = () => {
	localStorage.setItem("research_tasks", JSON.stringify(researchTasks.value));
};

const getStatusClass = (status: string) => {
	switch (status) {
		case "completed":
			return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
		case "in-progress":
			return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
	}
};

const selectSuggestion = (prompt: string) => {
	userInput.value = prompt;
	// Focus the input field
	nextTick(() => {
		if (textareaRef.value) {
			textareaRef.value.focus();
		}
	});
};

const formatTime = (timestamp: number): string => {
	const date = new Date(timestamp);
	return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const scrollToBottom = (): void => {
	nextTick(() => {
		if (messageContainer.value) {
			messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
		}
	});
};

const handleEnterKey = (event: KeyboardEvent): void => {
	// Send message on Enter, but allow Shift+Enter for new lines
	if (!event.shiftKey && userInput.value.trim()) {
		sendMessage();
	}
};

const sendMessage = async (): Promise<void> => {
	if (
		(!userInput.value.trim() && pendingFiles.value.length === 0) ||
		isLoading.value
	)
		return;

	// Create user message with files if any
	const userMessage: Message = {
		id: crypto.randomUUID(),
		role: "user",
		content: userInput.value.trim(),
		timestamp: Date.now(),
		files: [...pendingFiles.value], // Add any attached files
	};

	// Add user message
	messages.value.push(userMessage);

	// Clear input, files and scroll
	userInput.value = "";
	pendingFiles.value = [];
	scrollToBottom();

	// Show loading indicator
	isLoading.value = true;

	// Prepare for streaming or regular response
	const useStreaming = true; // Toggle this for testing
	let assistantMessage: Message;

	try {
		if (useStreaming) {
			// Create a placeholder streaming message
			assistantMessage = {
				id: crypto.randomUUID(),
				role: "assistant",
				content: "",
				timestamp: Date.now(),
				model: selectedModel.value,
				streaming: true,
			};

			// Add the placeholder message
			messages.value.push(assistantMessage);
			streamingMessage.value = assistantMessage;
			isStreaming.value = true;

			// Start streaming
			try {
				await openAIService.streamMessage(
					messages.value.slice(0, -1),
					(chunk) => {
						// Append each chunk to the message content
						if (streamingMessage.value) {
							streamingMessage.value.content += chunk;
							scrollToBottom();
						}
					},
				);
			} finally {
				// Done streaming
				if (streamingMessage.value) {
					streamingMessage.value.streaming = false;
				}
				isStreaming.value = false;
				streamingMessage.value = null;
			}
		} else {
			// Regular non-streaming response
			const response = await openAIService.sendMessage(messages.value);

			// Add assistant message
			messages.value.push({
				id: crypto.randomUUID(),
				role: "assistant",
				content: response,
				timestamp: Date.now(),
				model: selectedModel.value,
			});
		}
	} catch (error) {
		console.error("Error communicating with OpenAI:", error);

		// Remove streaming message if it exists
		if (isStreaming.value && streamingMessage.value) {
			const index = messages.value.findIndex(
				(m) => m.id === streamingMessage.value?.id,
			);
			if (index !== -1) {
				messages.value.splice(index, 1);
			}
		}

		// Add error message
		messages.value.push({
			id: crypto.randomUUID(),
			role: "assistant",
			content: "ขออภัยครับ มีข้อผิดพลาดในการเชื่อมต่อ โปรดลองอีกครั้งในภายหลัง",
			timestamp: Date.now(),
			model: selectedModel.value,
		});
	} finally {
		isLoading.value = false;
		isStreaming.value = false;
		streamingMessage.value = null;
		scrollToBottom();
	}
};

// Watch for changes in messages array to scroll to bottom
watch(
	messages,
	() => {
		scrollToBottom();
	},
	{ deep: true },
);

onMounted(() => {
	scrollToBottom();
});
</script>

<style>
/* ใช้ UnoCSS แทน CSS ทั้งหมด */
/* ประกาศ animation keyframes ใน style แทนการใช้ CSS-in-JS */
@keyframes typing {
  0% { transform: translateY(0); opacity: 0.3; }
  50% { transform: translateY(-4px); opacity: 1; }
  100% { transform: translateY(0); opacity: 0.3; }
}

@keyframes searchPulse {
  0% { transform: scale(1); opacity: 0.7; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
}

@keyframes researchIn {
  0% { opacity: 0; transform: translateY(10px); }
  50% { opacity: 0.5; }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* กำหนด animation สำหรับการพิมพ์ */
.animate-typing {
  animation: typing 1.5s infinite ease-in-out;
  animation-fill-mode: both;
}

/* ใช้ class จาก UnoCSS แทน */
.markdown-body {
  overflow-wrap: break-word;
}

.markdown-body pre {
  max-width: 100%;
  overflow-x: auto;
}

/* Custom image styling for markdown */
.markdown-body img {
  max-width: 100%;
  border-radius: 4px;
}

/* Animation for code highlighting */
.markdown-body pre code {
  transition: background-color 0.3s ease;
}

/* Mode-specific content styling */
.chat-mode-content ul,
.research-mode-content ul,
.thinking-mode-content ul {
  padding-left: 1.2rem;
}

.research-mode-content blockquote {
  border-left-color: #38a3fd;
  background-color: rgba(56, 163, 253, 0.05);
}

.thinking-mode-content blockquote {
  border-left-color: #9c64ec;
  background-color: rgba(156, 100, 236, 0.05);
}

/* Pulse animation for thinking mode brain icon */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>