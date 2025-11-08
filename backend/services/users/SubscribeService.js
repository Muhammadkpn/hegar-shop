const { SubscribeRepository } = require('../../repositories/users');

/**
 * Subscribe Service
 * Contains business logic for newsletter subscription operations
 */
class SubscribeService {
  constructor() {
    this.subscribeRepository = new SubscribeRepository();
  }

  /**
   * Subscribe to newsletter
   * @param {string} email
   * @returns {Promise<Object>}
   */
  async subscribe(email) {
    // Check if already subscribed
    const existing = await this.subscribeRepository.findByEmail(email);

    if (existing) {
      throw new Error('Email already subscribed');
    }

    return this.subscribeRepository.create({
      email,
      status: 1,
      subscribed_at: new Date(),
    });
  }

  /**
   * Unsubscribe from newsletter
   * @param {string} email
   * @returns {Promise<void>}
   */
  async unsubscribe(email) {
    const subscription = await this.subscribeRepository.findByEmail(email);

    if (!subscription) {
      throw new Error('Email not found in subscriptions');
    }

    await this.subscribeRepository.update(subscription.id, { status: 0 });
  }

  /**
   * Get all active subscriptions
   * @returns {Promise<Array>}
   */
  async getActiveSubscriptions() {
    return this.subscribeRepository.getActiveSubscriptions();
  }
}

module.exports = SubscribeService;
