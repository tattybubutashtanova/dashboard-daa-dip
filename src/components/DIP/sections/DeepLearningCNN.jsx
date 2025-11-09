import '../../shared/SectionStyles.css'

function DeepLearningCNN() {
  return (
    <div className="section-content">
      <h1>🤖 Deep Learning & CNN (for DIP)</h1>

      <section className="topic-card">
        <h2>Convolutional Neural Networks (CNN)</h2>
        <p>Specialized neural networks designed for processing grid-like data such as images. CNNs use convolutional layers to automatically learn spatial hierarchies of features.</p>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Key Components:</h3>
            <ul>
              <li><strong>Convolutional Layers:</strong> Apply filters to detect features</li>
              <li><strong>Pooling Layers:</strong> Reduce spatial dimensions (Max, Average)</li>
              <li><strong>Fully Connected Layers:</strong> Final classification/regression</li>
              <li><strong>Activation Functions:</strong> Introduce non-linearity</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Training Data vs. Testing Data</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Training Data</h3>
            <ul>
              <li>Used to train the model</li>
              <li>Model learns patterns and weights from this data</li>
              <li>Typically 70-80% of total dataset</li>
              <li>Can be further split into training and validation sets</li>
            </ul>
          </div>
          <div className="sub-topic">
            <h3>Testing Data</h3>
            <ul>
              <li>Used to evaluate final model performance</li>
              <li>Never seen during training</li>
              <li>Typically 20-30% of total dataset</li>
              <li>Provides unbiased estimate of model performance</li>
            </ul>
          </div>
        </div>
        <div className="formula">
          <p><strong>Typical Split:</strong> 70% Training, 15% Validation, 15% Testing</p>
        </div>
      </section>

      <section className="topic-card">
        <h2>Activation Functions</h2>
        <p>Non-linear functions applied to neuron outputs to introduce non-linearity into the network.</p>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>ReLU (Rectified Linear Unit)</h3>
            <div className="formula">
              <p><strong>Formula:</strong> f(x) = max(0, x)</p>
            </div>
            <p><strong>Properties:</strong></p>
            <ul>
              <li>Most popular activation function</li>
              <li>Computationally efficient</li>
              <li>Helps with vanishing gradient problem</li>
              <li>Output: 0 for negative inputs, x for positive inputs</li>
            </ul>
          </div>
          <div className="sub-topic">
            <h3>Sigmoid</h3>
            <div className="formula">
              <p><strong>Formula:</strong> f(x) = 1 / (1 + e^(-x))</p>
            </div>
            <p><strong>Properties:</strong></p>
            <ul>
              <li>Output range: (0, 1)</li>
              <li>Smooth, differentiable</li>
              <li>Can cause vanishing gradients</li>
              <li>Commonly used in binary classification output layer</li>
            </ul>
          </div>
          <div className="sub-topic">
            <h3>Softmax</h3>
            <div className="formula">
              <p><strong>Formula:</strong> f(x_i) = e^(x_i) / Σ(e^(x_j))</p>
            </div>
            <p><strong>Properties:</strong></p>
            <ul>
              <li>Outputs probability distribution</li>
              <li>Sum of outputs = 1</li>
              <li>Used in multi-class classification output layer</li>
              <li>Converts raw scores to probabilities</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Specification of Neurons in Input, Hidden, and Output Layers</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Input Layer</h3>
            <ul>
              <li>Number of neurons = number of input features</li>
              <li>For images: width × height × channels</li>
              <li>Example: 28×28×1 grayscale image = 784 neurons</li>
              <li>No activation function (or identity function)</li>
            </ul>
          </div>
          <div className="sub-topic">
            <h3>Hidden Layers</h3>
            <ul>
              <li>Number of neurons: design choice (typically powers of 2)</li>
              <li>Common sizes: 128, 256, 512, 1024</li>
              <li>Activation: Usually ReLU</li>
              <li>Multiple hidden layers create deep networks</li>
              <li>Deeper networks can learn more complex features</li>
            </ul>
          </div>
          <div className="sub-topic">
            <h3>Output Layer</h3>
            <ul>
              <li>Number of neurons = number of classes (classification) or 1 (regression)</li>
              <li>Binary classification: 1 neuron with sigmoid</li>
              <li>Multi-class: N neurons with softmax</li>
              <li>Regression: 1 neuron with linear/no activation</li>
            </ul>
          </div>
        </div>
        <div className="example-box">
          <p><strong>Example CNN Architecture:</strong></p>
          <pre>{`Input: 32×32×3 (RGB image)
Conv1: 32 filters, 3×3 → 30×30×32
Pool1: MaxPool 2×2 → 15×15×32
Conv2: 64 filters, 3×3 → 13×13×64
Pool2: MaxPool 2×2 → 6×6×64
Flatten: 2304 neurons
FC1: 128 neurons (ReLU)
FC2: 10 neurons (Softmax) → 10 classes`}</pre>
        </div>
      </section>

      <section className="topic-card">
        <h2>Libraries & Installation</h2>
        <div className="sub-topics">
          <div className="sub-topic">
            <h3>Deep Learning Frameworks</h3>
            <div className="code-block">
              <h4>Keras & TensorFlow (Python)</h4>
              <pre>{`pip install tensorflow
# or
pip install tensorflow-gpu  # for GPU support`}</pre>
              <p>Keras is now integrated into TensorFlow as tf.keras</p>
            </div>
            <div className="code-block">
              <h4>PyTorch (Python)</h4>
              <pre>{`pip install torch torchvision`}</pre>
            </div>
          </div>
          <div className="sub-topic">
            <h3>scikit-learn (sklearn)</h3>
            <div className="code-block">
              <pre>{`pip install scikit-learn`}</pre>
            </div>
            <p>Used for:</p>
            <ul>
              <li>Data preprocessing</li>
              <li>Model evaluation metrics</li>
              <li>Traditional ML algorithms</li>
              <li>Train/test splitting</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="topic-card">
        <h2>Basic CNN Implementation Example</h2>
        <div className="code-block">
          <pre>{`import tensorflow as tf
from tensorflow import keras

model = keras.Sequential([
    keras.layers.Conv2D(32, (3, 3), activation='relu', 
                        input_shape=(28, 28, 1)),
    keras.layers.MaxPooling2D((2, 2)),
    keras.layers.Conv2D(64, (3, 3), activation='relu'),
    keras.layers.MaxPooling2D((2, 2)),
    keras.layers.Flatten(),
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

model.fit(train_images, train_labels, epochs=10,
          validation_data=(val_images, val_labels))`}</pre>
        </div>
      </section>
    </div>
  )
}

export default DeepLearningCNN

